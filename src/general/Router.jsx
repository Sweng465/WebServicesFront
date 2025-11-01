import { Route, Routes } from "react-router-dom";

import { RoutePaths } from "./RoutePaths.jsx";
//import { Home } from "../home/Home.jsx";
import { Homepage } from "../pages/Homepage.jsx";
import { SignIn } from "../pages/SignIn.jsx";
import { SignUp } from "../pages/SignUp.jsx";
//import { BrowseVehicles } from "../pages/BrowseVehicles.jsx";
import BrowseVehicles from "../pages/BrowseVehicles.jsx";
import { NotFound } from "./NotFound.jsx";
import { Layout } from "./Layout.jsx";
import Profile from "../pages/Profile.jsx";
import SellItems from "../pages/SellItems.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export const Router = () => (
  <Routes>
    <Route
      path={RoutePaths.HOMEPAGE}
      element={
        <Layout>
          <Homepage />
        </Layout>
      }
    />
    <Route
      path={RoutePaths.SIGNIN}
      element={
        <Layout>
          <SignIn />
        </Layout>
      }
    />
    <Route
      path={RoutePaths.SIGNUP}
      element={
        <Layout>
          <SignUp />
        </Layout>
      }
    />
    <Route
      path={RoutePaths.PROFILE}
      element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path={RoutePaths.SELLITEMS}
      element={
        <ProtectedRoute>
          <Layout>
            <SellItems />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path={RoutePaths.BROWSECARS}
      element={
        <Layout>
          <BrowseVehicles />
        </Layout>
      }
    />
    <Route
      path="*"
      element={
        <Layout>
          <NotFound />
        </Layout>
      }
    />
  </Routes>
);
