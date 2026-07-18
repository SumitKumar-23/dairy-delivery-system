require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Subscription = require('./models/Subscription');
const Delivery = require('./models/Delivery');

const seedData = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Subscription.deleteMany({}),
    Delivery.deleteMany({}),
  ]);

  console.log('Creating users...');

  const customerData = [
    { name: 'Sumit Kumar', email: 'sumit@test.com', phone: '9999999999', password: 'test123', role: 'customer', address: [{ label: 'Home', street: '123 Main Street', city: 'Patna', state: 'Bihar', pincode: '800001', isDefault: true }] },
    { name: 'Priya Sharma', email: 'priya@test.com', phone: '9999999901', password: 'test123', role: 'customer', address: [{ label: 'Home', street: '45 Gandhi Road', city: 'Patna', state: 'Bihar', pincode: '800002', isDefault: true }] },
    { name: 'Aman Verma', email: 'aman@test.com', phone: '9999999902', password: 'test123', role: 'customer', address: [{ label: 'Home', street: '78 Station Road', city: 'Ludhiana', state: 'Punjab', pincode: '141001', isDefault: true }] },
    { name: 'Neha Singh', email: 'neha@test.com', phone: '9999999903', password: 'test123', role: 'customer', address: [{ label: 'Home', street: '12 Model Town', city: 'Ludhiana', state: 'Punjab', pincode: '141002', isDefault: true }] },
  ];
  const customers = [];
  for (const data of customerData) customers.push(await User.create(data));

  const vendorData = [
    { name: 'Amul Dairy', email: 'vendor@test.com', phone: '8888888888', password: 'test123', role: 'vendor', shopName: 'Amul Fresh Store' },
    { name: 'Mother Dairy Co.', email: 'vendor2@test.com', phone: '8888888801', password: 'test123', role: 'vendor', shopName: 'Mother Dairy Outlet' },
  ];
  const vendors = [];
  for (const data of vendorData) vendors.push(await User.create(data));

  const agentData = [
    { name: 'Rohit Delivery', email: 'agent@test.com', phone: '6666666666', password: 'test123', role: 'delivery_agent', vehicleNumber: 'BR01AB1234', assignedZone: 'Sector A' },
    { name: 'Vikas Kumar', email: 'agent2@test.com', phone: '6666666601', password: 'test123', role: 'delivery_agent', vehicleNumber: 'BR01CD5678', assignedZone: 'Sector B' },
  ];
  const agents = [];
  for (const data of agentData) agents.push(await User.create(data));

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    phone: '7777777777',
    password: 'test123',
    role: 'admin',
  });

  console.log('Creating products...');

  const [vendorA, vendorB] = vendors;

  const products = await Product.insertMany([
    // Milk
    { vendor: vendorA._id, name: 'Amul Gold Milk', category: 'Milk', price: 34, unit: '500 ml', stock: 300 },
    { vendor: vendorA._id, name: 'Amul Taaza Milk', category: 'Milk', price: 28, unit: '500 ml', stock: 250 },
    { vendor: vendorB._id, name: 'Mother Dairy Toned Milk', category: 'Milk', price: 26, unit: '500 ml', stock: 280 },
    { vendor: vendorB._id, name: 'Mother Dairy Full Cream Milk', category: 'Milk', price: 32, unit: '500 ml', stock: 200 },
    // Curd
    { vendor: vendorA._id, name: 'Amul Fresh Curd', category: 'Curd', price: 40, unit: '400 g', stock: 150 },
    { vendor: vendorB._id, name: 'Mother Dairy Curd', category: 'Curd', price: 38, unit: '400 g', stock: 140 },
    // Paneer
    { vendor: vendorA._id, name: 'Amul Malai Paneer', category: 'Paneer', price: 90, unit: '200 g', stock: 90 },
    { vendor: vendorB._id, name: 'Mother Dairy Paneer', category: 'Paneer', price: 85, unit: '200 g', stock: 85 },
    // Butter
    { vendor: vendorA._id, name: 'Amul Butter', category: 'Butter', price: 52, unit: '100 g', stock: 120 },
    { vendor: vendorB._id, name: 'Mother Dairy Butter', category: 'Butter', price: 50, unit: '100 g', stock: 100 },
    // Cheese
    { vendor: vendorA._id, name: 'Amul Cheese Slices', category: 'Cheese', price: 120, unit: '200 g', stock: 70 },
    { vendor: vendorB._id, name: 'Mother Dairy Cheese Cubes', category: 'Cheese', price: 115, unit: '200 g', stock: 65 },
    // Ghee
    { vendor: vendorA._id, name: 'Amul Pure Ghee', category: 'Ghee', price: 550, unit: '1 L', stock: 60 },
    { vendor: vendorB._id, name: 'Mother Dairy Ghee', category: 'Ghee', price: 530, unit: '1 L', stock: 55 },
    // Cream
    { vendor: vendorA._id, name: 'Amul Fresh Cream', category: 'Cream', price: 65, unit: '200 ml', stock: 75 },
    // Yogurt
    { vendor: vendorA._id, name: 'Amul Greek Yogurt', category: 'Yogurt', price: 55, unit: '200 g', stock: 95 },
    { vendor: vendorB._id, name: 'Mother Dairy Yogurt', category: 'Yogurt', price: 50, unit: '200 g', stock: 90 },
    // Flavored Milk
    { vendor: vendorA._id, name: 'Amul Kool Chocolate Milk', category: 'Flavored Milk', price: 30, unit: '200 ml', stock: 130 },
    { vendor: vendorA._id, name: 'Amul Kool Strawberry Milk', category: 'Flavored Milk', price: 30, unit: '200 ml', stock: 110 },
    { vendor: vendorB._id, name: 'Mother Dairy Badam Milk', category: 'Flavored Milk', price: 35, unit: '200 ml', stock: 100 },
  ]);

  console.log('Creating sample orders...');

  const [sumit, priya, aman, neha] = customers;
  const milk = products[0];
  const curd = products[4];
  const paneer = products[6];

  const sampleOrders = await Order.insertMany([
    {
      customer: sumit._id,
      items: [{ product: milk._id, name: milk.name, price: milk.price, quantity: 2 }],
      deliveryAddress: sumit.address[0],
      orderType: 'one-time',
      subtotal: milk.price * 2,
      deliveryCharge: 20,
      totalAmount: milk.price * 2 + 20,
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
    },
    {
      customer: priya._id,
      items: [
        { product: curd._id, name: curd.name, price: curd.price, quantity: 1 },
        { product: paneer._id, name: paneer.name, price: paneer.price, quantity: 1 },
      ],
      deliveryAddress: priya.address[0],
      orderType: 'one-time',
      subtotal: curd.price + paneer.price,
      deliveryCharge: 20,
      totalAmount: curd.price + paneer.price + 20,
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      orderStatus: 'placed',
    },
    {
      customer: aman._id,
      items: [{ product: milk._id, name: milk.name, price: milk.price, quantity: 3 }],
      deliveryAddress: aman.address[0],
      orderType: 'one-time',
      subtotal: milk.price * 3,
      deliveryCharge: 0,
      totalAmount: milk.price * 3,
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'out_for_delivery',
    },
    {
      customer: neha._id,
      items: [{ product: paneer._id, name: paneer.name, price: paneer.price, quantity: 2 }],
      deliveryAddress: neha.address[0],
      orderType: 'one-time',
      subtotal: paneer.price * 2,
      deliveryCharge: 20,
      totalAmount: paneer.price * 2 + 20,
      paymentMethod: 'Card',
      paymentStatus: 'paid',
      orderStatus: 'assigned',
    },
  ]);

  console.log('Creating deliveries for orders...');

  await Delivery.insertMany([
    { order: sampleOrders[0]._id, customer: sumit._id, deliveryAgent: agents[0]._id, deliveryAddress: sumit.address[0], zone: 'Sector A', scheduledDate: new Date(), status: 'delivered', deliveredAt: new Date() },
    { order: sampleOrders[1]._id, customer: priya._id, deliveryAddress: priya.address[0], zone: 'Unassigned', scheduledDate: new Date(), status: 'pending' },
    { order: sampleOrders[2]._id, customer: aman._id, deliveryAgent: agents[1]._id, deliveryAddress: aman.address[0], zone: 'Sector B', scheduledDate: new Date(), status: 'out_for_delivery' },
    { order: sampleOrders[3]._id, customer: neha._id, deliveryAgent: agents[0]._id, deliveryAddress: neha.address[0], zone: 'Sector A', scheduledDate: new Date(), status: 'assigned' },
  ]);

  console.log('Creating subscriptions...');

  await Subscription.insertMany([
    { customer: sumit._id, product: milk._id, quantity: 1, frequency: 'daily', deliveryTime: 'Morning', deliveryAddress: sumit.address[0], startDate: new Date(), status: 'active' },
    { customer: priya._id, product: curd._id, quantity: 1, frequency: 'alternate_days', deliveryTime: 'Morning', deliveryAddress: priya.address[0], startDate: new Date(), status: 'active' },
    { customer: aman._id, product: milk._id, quantity: 2, frequency: 'weekly', weeklyDays: ['Monday', 'Thursday'], deliveryTime: 'Evening', deliveryAddress: aman.address[0], startDate: new Date(), status: 'paused' },
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('Login credentials (password for all: test123):');
  console.log(`  Customers: ${customers.map((c) => c.email).join(', ')}`);
  console.log(`  Vendors:   ${vendors.map((v) => v.email).join(', ')}`);
  console.log(`  Agents:    ${agents.map((a) => a.email).join(', ')}`);
  console.log(`  Admin:     ${admin.email}`);
  console.log(`\nCreated ${products.length} products, ${sampleOrders.length} orders, 4 deliveries, 3 subscriptions.`);

  mongoose.connection.close();
  process.exit(0);
};

seedData().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});