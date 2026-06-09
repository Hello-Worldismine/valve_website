import { useState } from 'react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import CategoryGrid from './components/CategoryGrid'
import FeatureStrip from './components/FeatureStrip'
import ProductSection from './components/ProductSection'
import BrandSection from './components/BrandSection'
import Footer from './components/Footer'
import ProductDetail from './components/ProductDetail'

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setSelectedProduct(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={handleBack} />
      ) : (
        <main>
          <HeroBanner />
          <FeatureStrip />
          <CategoryGrid />
          <ProductSection onProductClick={handleProductClick} />
          <BrandSection />
        </main>
      )}
      <Footer />
    </div>
  )
}
