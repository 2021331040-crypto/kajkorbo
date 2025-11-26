import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import {toggleAuthPopup, toggleCart, toggleSearchBar, toggleSidebar} from "../../store/slices/popupSlice"
const Navbar = () => {
  const{theme, toggleTheme}=useTheme();

  const dispatch= useDispatch();

  const {cart}= useSelector(state => state.cart);
  let cartItemsCount=0;
  if (cart){
    cartItemsCount=cart.reduce((total,item)=>total+item.quantity,0);
  }
  return <>
    <nav className="fixed left-0 w-full to-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT - HAMBURGER MENU*/}
          <button onClick={()=>dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Menu className="w-6 h-6 text-foreground"/>
          </button>
          {/*center logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-primary">ShopMate</h1>
          </div>

          {/*right side icons */}
          <div className="flex items-center space-x-2">
            {/* theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {
                theme==="dark"?(
                  <Sun className="w-5 h-5 text-foreground"/>
                ):(
                  <Moon className="w-5 h-5 text-foreground"/>
                )
              }
            </button>
            {/*search overlay */}
            <button onClick={()=>dispatch(toggleSearchBar())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Search className="w-5 h-5 text-foreground"/>
            </button>

            {/*user profile */}
            <button onClick={()=>dispatch(toggleAuthPopup())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <User className="w-5 h-5 text-foreground"/>
            </button>

              {/*cart */}
            <button onClick={()=>dispatch(toggleCart())} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground"/>
              {
                cartItemsCount>0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartItemsCount}</span>
                )
              }
            </button>

          </div>
        </div>
      </div>
    </nav>
  
  </>;
};

export default Navbar;
