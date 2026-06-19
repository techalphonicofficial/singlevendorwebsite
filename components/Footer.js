import Link from "next/link";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";


export default function Footer() {

  return (

    <footer className="footer-section d-none d-md-flex">


      <div className="container-lg py-5">



        {/* BRAND */}

        <div className="footer-brand">


          <img
            src="/logowhite.png"
            alt="Fitstory"
            className="footer-logo"
          />
          {/* SOCIAL ICONS */}

          <div className="footer-social">

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaYoutube />
            </a>

          </div>


        </div>







        <div className="row gy-5">



          {/* CATEGORIES */}

          <div className="col-md-3">

            <h6 className="footer-title">
              CATEGORIES
            </h6>


            <ul className="footer-list">

              <li>
                <Link href="/shop">
                  Mens
                </Link>
              </li>

              <li>
                <Link href="/shop">
                  Casual Shirts
                </Link>
              </li>


              <li>
                <Link href="/shop">
                  Suits
                </Link>
              </li>


              <li>
                <Link href="/shop">
                  Nehru Jackets
                </Link>
              </li>


              <li>
                <Link href="/shop">
                  Indo Western
                </Link>
              </li>


            </ul>


          </div>







          {/* SUPPORT */}

          <div className="col-md-2">


            <h6 className="footer-title">
              SUPPORT
            </h6>


            <ul className="footer-list">


              <li>
                <Link href="/track-order">
                  Track Order
                </Link>
              </li>


              <li>
                <Link href="/contact">
                  Contact Us
                </Link>
              </li>


              <li>
                <Link href="/account">
                  My Account
                </Link>
              </li>


            </ul>


          </div>









          {/* QUICK LINKS */}

          <div className="col-md-2">


            <h6 className="footer-title">
              QUICK LINKS
            </h6>


            <ul className="footer-list">


              <li>
                <Link href="/about">
                  About Us
                </Link>
              </li>


              <li>
                <Link href="/blogs">
                  Blogs
                </Link>
              </li>


              <li>
                <Link href="/contact">
                  Contact
                </Link>
              </li>


              <li>
                <Link href="/careers">
                  Careers
                </Link>
              </li>


            </ul>


          </div>









          {/* POLICIES */}

          <div className="col-md-2">


            <h6 className="footer-title">
              OUR POLICIES
            </h6>


            <ul className="footer-list">


              <li>
                <Link href="/faq">
                  FAQs
                </Link>
              </li>


              <li>
                <Link href="/shipping">
                  Shipping Details
                </Link>
              </li>


              <li>
                <Link href="/return-policy">
                  Return Policy
                </Link>
              </li>


              <li>
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>


            </ul>


          </div>









          {/* CONTACT */}

          <div className="col-md-3">


            <h6 className="footer-title">
              CONTACT
            </h6>


            <ul className="footer-list">


              <li>
                <a href="mailto:care@fitstory.com">
                  care@fitstory.com
                </a>
              </li>


              <li>
                Call us : 1800-120-000-500
              </li>


              <li>
                +91 9674373838
              </li>


              <li>
                10 am - 7 pm, Monday - Saturday
              </li>


            </ul>


          </div>



        </div>






        <div className="footer-bottom">


          © 2026 Fitstory. All Rights Reserved.


        </div>





      </div>


    </footer>

  );

}