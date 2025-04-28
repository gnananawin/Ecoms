import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe";
import User from "../models/User.js";

//Ordering with COD feature
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    let amount = await items.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const product = await Product.findById(item.product);
      return acc + product.offerPrice * item.quantity;
    }, Promise.resolve(0));

    amount += Math.floor(amount * 0.02);

    const newOrder = new Order({
      userId: req.userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    await newOrder.save();
    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Order placement error (COD):", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Ordering with Online Payment Feature
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const origin = req.headers.origin;

    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    const productData = [];
    let amount = await items.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return acc + product.offerPrice * item.quantity;
    }, Promise.resolve(0));

    amount += Math.floor(amount * 0.02);

    const newOrder = new Order({
      userId: req.userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    await newOrder.save();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: req.userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Order placement error (Stripe):", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Using Stripe for Online Payments
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const { orderId, userId } = sessionList.data[0].metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const { orderId } = sessionList.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ success: false, message: "Failed to get orders" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to get orders" });
  }
};
