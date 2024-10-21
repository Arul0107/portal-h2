const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Import models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Document = require('./models/Document');
const Asset = require('./models/Asset'); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// MongoDB connection
mongoose.connect('mongodb+srv://arulupsc:7ht4hONhEWXuOPKt@cluster1.izzpz.mongodb.net/myDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Generate Employee ID
const generateEmployeeID = async () => {
  const lastEmployee = await Employee.findOne().sort({ employee_id: -1 });
  let newEmployeeID = 'dotsemp01'; // Default for the first employee

  if (lastEmployee) {
    const lastIDNumber = parseInt(lastEmployee.employee_id.slice(7)); // Get numeric part from ID
    const nextIDNumber = (lastIDNumber + 1).toString().padStart(2, '0');
    newEmployeeID = `dotsemp${nextIDNumber}`;
  }

  return newEmployeeID;
};

// Get Latest Employee ID
app.get('/latest-employee-id', async (req, res) => {
  try {
    const lastEmployee = await Employee.findOne().sort({ employee_id: -1 });
    const latestEmployeeID = lastEmployee ? lastEmployee.employee_id : 'dotsemp00';
    res.status(200).json({ latestEmployeeID });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest employee ID' });
  }
});

// Employee Registration
app.post('/register', async (req, res) => {
  const { email, employee_id, name, gender, dob, phone_number, address, department_id, asset_id, role, password } = req.body;

  try {
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      employee_id,
      name,
      gender,
      dob,
      phone_number,
      address,
      email,
      department_id,
      asset_id,
      role,
    });

    await newEmployee.save();

    const newUser = new User({
      email,
      password: hashedPassword,
      employee_id,
    });

    await newUser.save();

    res.status(201).json({ message: 'Employee registered successfully', employee: newEmployee });
  } catch (error) {
    console.error("Error during employee registration:", error.stack); // Log stack trace
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const employee = await Employee.findOne({ employee_id: user.employee_id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Login successful', user: employee });
  } catch (error) {
    console.error("Error during user login:", error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload Document
app.post('/documents/upload', upload.single('file'), async (req, res) => {
  const { employee_id, doc_category, doc_name } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const newDocument = new Document({
      doc_id: Date.now().toString(),
      employee_id, // Ensure this is defined in the Document schema
      doc_category,
      doc_name,
      doc_filepath: req.file.path,
    });

    await newDocument.save();

    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    console.error("Error during document upload:", error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Documents by Employee ID
app.get('/documents/:employee_id', async (req, res) => {
  try {
    const documents = await Document.find({ employee_id: req.params.employee_id });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a Document by ID
app.delete('/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all employees with associated user data
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().lean();
    const users = await User.find().lean();

    const employeeData = employees.map(emp => {
      const user = users.find(u => u.employee_id === emp.employee_id);
      return { ...emp, email: user?.email || '', role: emp.role };
    });

    res.status(200).json(employeeData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an Employee by ID
app.put('/employees/:id', async (req, res) => {
  const { email, role, employee_id, name, gender, dob, phone_number, address, department_id, asset_id } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.gender = gender || employee.gender;
    employee.dob = dob || employee.dob;
    employee.phone_number = phone_number || employee.phone_number;
    employee.address = address || employee.address;
    employee.department_id = department_id || employee.department_id;
    employee.asset_id = asset_id || employee.asset_id;
    employee.role = role || employee.role;

    await employee.save();

    if (email) {
      const user = await User.findOne({ employee_id: employee.employee_id });
      if (user) {
        user.email = email;
        await user.save();
      }
    }

    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an Employee by ID
app.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.deleteOne({ employee_id: employee.employee_id });

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Asset Registration Route
// Asset Registration Route
app.post('/assets/register', async (req, res) => {
  const { name, type, condition, employee_id, department, status } = req.body;

  // Ensure the asset_id is generated if not provided
  const asset_id = req.body.asset_id || `AST${Date.now().toString().slice(-4)}`;

  try {
    // Check if employee exists
    const employee = await Employee.findOne({ employee_id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Create new asset
    const newAsset = new Asset({
      asset_id, // Automatically generated or passed from the frontend
      name,
      type,
      condition,
      employee_id,
      employee_name: employee.name, // Assigning employee name from Employee model
      department,
      status: status || 'received',
    });

    await newAsset.save(); // Save to MongoDB
    res.status(201).json({ message: 'Asset registered successfully', asset: newAsset });
  } catch (error) {
    console.error('Error during asset registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get all assets
app.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update asset
app.put('/assets/:id', async (req, res) => {
  const { name, type, condition, employee_id, department, status } = req.body;

  try {
    // Find asset by ID
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Update fields
    asset.name = name || asset.name;
    asset.type = type || asset.type;
    asset.condition = condition || asset.condition;
    asset.employee_id = employee_id || asset.employee_id;
    asset.department = department || asset.department;
    asset.status = status || asset.status;

    // Save updated asset
    await asset.save();
    res.status(200).json({ message: 'Asset updated successfully', asset });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete asset
app.delete('/assets/:id', async (req, res) => {
  try {
    // Delete asset by ID
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
