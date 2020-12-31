import { useRef, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { createPortal } from "react-dom";
import debounce from "lodash/debounce";

const modalRoot = document.getElementById("portal-root");
function Modal({ isOpen, coords, children }) {
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return isOpen && createPortal(children, el);
}

function Popover({ children, coords, updateCoords }) {
  const updateCoordsWithDeb = debounce(updateCoords, 100);
  useEffect(() => {
    window.addEventListener("resize", updateCoordsWithDeb);
    return () => window.removeEventListener("resize", updateCoordsWithDeb);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        width: 200,
        transform: "translate(-100px, 0)",
        ...coords,
      }}
      className="ant-popover ant-popover-placement-bottom"
    >
      <div className="ant-popover-content">
        <div className="ant-popover-arrow" />
        <div className="ant-popover-inner" role="tooltip">
          <div>
            <div className="ant-popover-inner-content">Title</div>
            <div className="ant-popover-inner-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [coords, setCoords] = useState({});
  const btnRef = useRef(null);

  const toggleModal = () => setModalOpen(!isModalOpen);
  const updateTooltipCoords = (button) => {
    console.log(button);
    const rect = button.getBoundingClientRect();
    console.log(rect);
    setCoords({
      left: rect.x + rect.width / 2,
      top: rect.bottom + window.scrollY,
    });
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <button
        style={{ display: "flex" }}
        ref={btnRef}
        onClick={(e) => {
          updateTooltipCoords(e.target);
          toggleModal();
        }}
      >
        open modal
      </button>

      <Modal isOpen={isModalOpen}>
        <Popover
          coords={coords}
          updateCoords={() => updateTooltipCoords(btnRef.current)}
        >
          <div>asjdklahsdhajsdhjahsdkj</div>
          <button onClick={toggleModal}>click me</button>
        </Popover>
      </Modal>
    </div>
  );
}

export default App;
