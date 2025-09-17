import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PrivateLayout from "./Layout/PrivateLayout";
import ContentManagement from "./Pages/Content";
import { Dashboard } from "./Pages/Dashboard";
import Login from "./Pages/Auth/Login";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./Firebase/Firebase";
import { useDispatch, useSelector } from "react-redux";
import { addAuth, removeAuth } from "./Slices/authSlice";
import Program from "./Pages/Program";
import FocusArea from "./Pages/FocusArea";
import Habit from "./Pages/Habit";

function App() {
  const dispatch = useDispatch();

  const { User } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(addAuth({ Name: user.displayName, Email: user.email }));
      } else {
        dispatch(removeAuth());
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) return null;
  return (
    <BrowserRouter>
      {User && User.Email ? (
        <Routes>
          <Route element={<PrivateLayout />}>
            <Route path="/*" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/program" element={<Program />} />
            <Route path="/focus-area" element={<FocusArea />} />
            <Route path="/habit" element={<Habit />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
