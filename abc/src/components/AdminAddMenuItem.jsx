import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/menuItem.css'
import Navbar from "../components/NavigationBar";
const AdminAddMenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [img, setImg] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [editMenuItem, setEditMenuItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:4000/menu_category/category');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('http://localhost:4000/menu_item/menu-items/get-all-menu-items');
      setMenuItems(res.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Error fetching menu items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const menuItem = { name, description, price, available, img, categoryId };

    try {
      if (editMenuItem) {
        // Update existing menu item
        await axios.put(`http://localhost:4000/menu_item/menu-items/update/${editMenuItem.food_id}`, menuItem);
        toast.success('Menu item updated successfully');
      } else {
        // Add new menu item
        await axios.post('http://localhost:4000/menu_item/menu-items/add', menuItem);
        toast.success('Menu item added successfully');
      }
      fetchMenuItems(); // Refresh the list after adding/updating
      resetForm();
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Error saving menu item');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result); // Convert the image to base64
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setAvailable(true);
    setImg(null);
    setCategoryId('');
    setEditMenuItem(null);
  };

  const handleDelete = async (foodId) => {
    try {
      await axios.delete(`http://localhost:4000/menu_item/menu-items/delete/${foodId}`);
      toast.success('Menu item deleted successfully');
      fetchMenuItems(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Error deleting menu item');
    }
  };

  const handleEdit = (item) => {
    setEditMenuItem(item); // Set the item to be edited
    setName(item.item_name);
    setDescription(item.item_description);
    setPrice(item.price);
    setAvailable(item.available);
    setImg(item.item_img);
    setCategoryId(item.category_id);
    setShowModal(true); // Open modal for editing
  };

  const handleModalClose = () => setShowModal(false);

  const handleAddNewMenuItem = () => {
    resetForm();
    setShowModal(true); // Open modal for adding new menu item
  };
console.log(categoryId)
  return (
    <>
    <Navbar/>
      <Container className="menu-item-container mt-5">
        <ToastContainer autoClose={5000} />
        <h1 className="text-center mb-4">Manage Menu Items</h1>

        <div className="add-menu-item-wrapper">
          <Button variant="primary" onClick={handleAddNewMenuItem} className="mb-4 add-menu-item-button">
            Add New Menu Item
          </Button>
        </div>

        <Row className="category-list">
          {menuItems.map((item) => (
            <Col md={4} key={item.food_id} className="mb-4">
              <Card className="menu-item-card shadow-sm "style={{width:'350px'}}>
                <Card.Img
                  variant="top"
                  src={item.item_img}
                  alt={item.name}
                  
                />
                <Card.Body>
                  <Card.Title>{item.item_name}</Card.Title>
                  <Card.Text>{item.item_description}</Card.Text>
                  <Card.Text><strong>Price: </strong>${item.price}</Card.Text>
                  <Card.Text><strong>Status: </strong>{item.available ? 'Available' : 'Not Available'}</Card.Text>
                  <Button variant="warning" onClick={() => handleEdit(item)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(item.food_id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal for form */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMenuItem ? 'Update Menu Item' : 'Add Menu Item'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="itemName" className="mb-3">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter item name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="itemPrice" className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="itemDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="itemAvailable" className="mb-3">
                    <Form.Label>Availability</Form.Label>
                    <Form.Select value={available} onChange={(e) => setAvailable(e.target.value === 'true')} required>
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="itemCategory" className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="itemImage" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                {editMenuItem ? 'Update Menu Item' : 'Add Menu Item'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AdminAddMenuItem;
