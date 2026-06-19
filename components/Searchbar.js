import React from 'react'
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";


// const allProducts = [
//     { id: 1, name: 'Regal Brocade Sherwani', category: 'Sherwanis', price: 32999, rating: 4.8, img: "/DAJ_4613.jpg" },
//     { id: 2, name: 'Embroidered Kurta Set', category: 'Kurta Sets', price: 14499, rating: 4.6, img: "/DAJ_4661.jpg" },
//     { id: 3, name: 'Velvet Nehru Jacket', category: 'Indo-Western', price: 11999, rating: 4.4, img: "/DAJ_4366.jpg" },
//     { id: 4, name: 'Silk Juttis', category: 'Accessories', price: 2299, rating: 4.7, img: "/DAJ_4291.jpg" },
//     { id: 5, name: 'Festive Bandhgala', category: 'Indo-Western', price: 18499, rating: 4.5, img: "/DAJ_4366.jpg" },
//     { id: 6, name: 'Cotton Pathani Set', category: 'Kurta Sets', price: 9299, rating: 4.3, img: "/DAJ_4661.jpg" },
//     { id: 7, name: 'Classic Sherwani', category: 'Sherwanis', price: 26999, rating: 4.9, img: "/DAJ_4613.jpg" },
//     { id: 8, name: 'Groom Accessory Box', category: 'Accessories', price: 4999, rating: 4.2, img: "/DAJ_4291.jpg" }
// ];

const Searchbar = () => {

    const [search, setSearch] = useState('');
    const [find, setFind] = useState('')
    const router = useRouter();

    const placeholders = [
    "Search for jeans...",
    "Search for shirts...",
    "Search for sneakers...",
    "Search for hoodies...",
    "Search for ethnic wear...",
    "Search for kurta sets..."
  ];

  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const typing = setInterval(() => {

      currentText =
        placeholders[placeholderIndex].slice(0, currentIndex + 1);

      setText(currentText);

      currentIndex++;

      if (
        currentIndex ===
        placeholders[placeholderIndex].length
      ) {

        clearInterval(typing);

        setTimeout(() => {

          const deleting = setInterval(() => {

            currentText = currentText.slice(0, -1);

            setText(currentText);

            if (currentText.length === 0) {

              clearInterval(deleting);

              setPlaceholderIndex((prev) =>
                (prev + 1) % placeholders.length
              );
            }

          }, 40);

        }, 1200);
      }

    }, 80);

    return () => clearInterval(typing);

  }, [placeholderIndex]);

    const handlechange = (e) => {
        e.preventDefault()
        setSearch(e.target.value)
    }
    const handlesearch = () => {
        router.push(`/shop?search=${search}`);
        setSearch('')
    };

    return (
        <div className="input-group shadow-sm rounded-pill overflow-hidden position-relative" style={{ maxWidth: '500px' }}>
            <input
                type="text"
                placeholder={text}
                onChange={handlechange}
                className="form-control  rounded-start-pill ps-5 py-2 h-10 "
               
            />
             <Search size={20} className='searchicon' />

            <button
                onClick={handlesearch}
                className="btn btn-warning rounded-end-pill px-4"
            >
                Search
            </button>
        </div>
    )
}

export default Searchbar
