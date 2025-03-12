import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

interface ProductCategory {
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  stock: string;
  sku?: string;
  category?: ProductCategory;
  user_id: string;
  created_at?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get<Product>(`/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/products/${id}`);
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        navigate('/products');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete product. Please try again.', 'error');
        console.error('Delete error:', error);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Product not found'}</span>
        <Link to="/products" className="block mt-4 text-blue-600 hover:underline">
          Return to product listing
        </Link>
      </div>
    );
  }
  
  const canEdit = hasRole('Admin') || product.user_id === localStorage.getItem('user_id');
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex space-x-2">
            <Link
              to="/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </Link>
            
            {canEdit && (
              <>
                <Link
                  to={`/products/${id}/edit`}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            {product.category && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Category</h2>
                <p className="text-gray-700">{product.category.name}</p>
              </div>
            )}
            
            {product.created_at && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Added On</h2>
                <p className="text-gray-700">{new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Price</h2>
              <p className="text-2xl font-bold text-green-600">${parseFloat(product.price).toFixed(2)}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Stock</h2>
              <p className={`text-xl font-semibold ${parseInt(product.stock) > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {parseInt(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>
            
            {product.sku && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">SKU</h2>
                <p className="text-gray-700">{product.sku}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;