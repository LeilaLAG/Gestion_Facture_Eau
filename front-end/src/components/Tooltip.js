import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="position-relative d-inline-block">
        {visible && (
        <div style={{whiteSpace:"nowrap" , fontSize : "13px"}} className="position-absolute start-50 translate-middle-x bottom-100 mb-1 bg-dark text-white text-sm px-3 py-1 rounded shadow-lg fade show">
          {text}
        </div>
      )}
      <div
        className="cursor-pointer"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      
    </div>
  );
};

export default Tooltip
