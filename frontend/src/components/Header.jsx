// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import logo from '../assets/icon.png';

// function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 10) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-5'}`}>
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <div className="flex items-center">
//           <div className="rounded-lg mr-3">
//             <img src={logo} alt="ServeUp Logo" className="h-10 w-10" />
//           </div>
//           <span className="text-3xl font-bold text-white">FuturePlay</span>
//         </div>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex space-x-8">
//           <a href="#home" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
//             Home
//             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
//           </a>
//           <a href="#features" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
//             Features
//             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
//           </a>
//           <a href="#upcoming-tournaments" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
//             Tournaments
//             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
//           </a>
//           <a href="#contact" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
//             Contact
//             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
//           </a>
//         </nav>

//         {/* Desktop Buttons */}
//         <div className="hidden md:flex space-x-3">
//   <Link 
//     to="/organizer/login" 
//     className="bg-transparent border-2 border-red-500 text-white hover:bg-red-500 font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
//   >
//     Organizers
//   </Link>
//   <Link 
//     to="/player/login" 
//     className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
//   >
//     Players
//   </Link>
// </div>

//         {/* Mobile Menu Button */}
//         <button 
//           className="md:hidden text-white focus:outline-none"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             {isMenuOpen ? (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//   <nav className="md:hidden bg-gray-800/95 backdrop-blur-sm px-4 py-5 absolute w-full border-t border-gray-700">
//     <div className="flex flex-col space-y-4">
//       <a href="#home" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Home</a>
//       <a href="#features" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Features</a>
//       <a href="#upcoming-tournaments" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Tournaments</a>
//       <a href="#contact" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Contact</a>
      
//       <div className="flex flex-col space-y-3 pt-2">
//         <Link 
//           to="/organizer/login" 
//           className="bg-transparent border-2 border-red-500 text-white hover:bg-red-500 font-bold py-2 px-5 rounded-md transition duration-300 shadow-md text-center"
//         >
//           Organizers
//         </Link>
//         <Link 
//           to="/player/login" 
//           className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
//         >
//           Players
//         </Link>
//       </div>
//     </div>
//   </nav>
// )}
//     </header>
//   );
// }

// export default Header;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import logo from '../assets/icon.png';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const isPlayerLoggedIn = user && user.role === "player";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setProfileMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-lg mr-3">
            <img src={logo} alt="ServeUp Logo" className="h-10 w-10" />
          </div>
          <span className="text-3xl font-bold text-white">FuturePlay</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#home" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#features" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#upcoming-tournaments" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
            Tournaments
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#contact" className="text-white hover:text-red-400 transition duration-300 font-medium relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link 
            to="/organizer/login" 
            className="bg-transparent border-2 border-red-500 text-white hover:bg-red-500 font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
          >
            Organizers
          </Link>
          
          {isPlayerLoggedIn ? (
  <div className="relative">
    <button 
      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold h-10 w-10 rounded-full transition duration-300 shadow-md"
    >
      {user.name.charAt(0).toUpperCase()}
    </button>
    
    {profileMenuOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
        <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
          Signed in as <span className="font-semibold">{user.name}</span>
        </div>
        <Link
          to="/player/profile"
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
          onClick={() => setProfileMenuOpen(false)}
        >
          Your Profile
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          Sign out
        </button>
      </div>
    )}
  </div>
) : (
  <Link 
    to="/player/login" 
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
  >
    Players
  </Link>
)}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800/95 backdrop-blur-sm px-4 py-5 absolute w-full border-t border-gray-700">
          <div className="flex flex-col space-y-4">
            <a href="#home" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Home</a>
            <a href="#features" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Features</a>
            <a href="#upcoming-tournaments" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Tournaments</a>
            <a href="#contact" className="text-white hover:text-red-400 transition duration-300 py-2 font-medium">Contact</a>
            
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/organizer/login" 
                className="bg-transparent border-2 border-red-500 text-white hover:bg-red-500 font-bold py-2 px-5 rounded-md transition duration-300 shadow-md text-center"
              >
                Organizers
              </Link>
              
              {isPlayerLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-2 bg-gray-700 rounded-md">
                    <div className="bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                  <Link
                    to="/player/profile"
                    className="block bg-gray-700 text-white font-medium py-2 px-5 rounded-md transition duration-300 text-center"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/player/login" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 shadow-md"
                >
                  Players
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;