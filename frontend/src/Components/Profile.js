import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

// Components
import ProfileUpdate from "./ProfileUpdate";

// MUI
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerId: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  function ReducerFuction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

  // request to get profile info
  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8001/api/profiles/${GlobalState.userId}/`
        );

        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (e) {}
    }
    GetProfileInfo();
  }, []);

  function PropertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          disabled
          size="small"
        >
          No Property
        </Button>
      );
    } else if (state.userProfile.sellerListings.length === 1) {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size="small"
        >
          One Property listed
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          size="small"
        >
          {state.userProfile.sellerListings.length} Properties
        </Button>
      );
    }
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          Welcome{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {GlobalState.userUsername}
          </span>{" "}
          , please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",

            marginTop: "1rem",
            padding: "10px",
            // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            boxShadow:
              "rgba(0, 0, 0, 0.3) 0px 10px 12px, rgba(0, 0, 0, 0.22) 0px 5px 6px",
          }}
        >
          <Grid item xs={6}>
            <img
              style={{ height: "10rem", width: "15rem" }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            xs={6}
          >
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                Welcome{" "}
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {GlobalState.userUsername}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                You have {PropertiesDisplay()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <>
      <div>{WelcomeDisplay()}</div>

      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
