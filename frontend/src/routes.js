import { createBrowserRouter } from "react-router";
import { Welcome } from "./components/Welcome";
import { LoginConsent } from "./components/Register";
import { LivenessModule } from "./components/LivenessModule";
import { PANOCRScreen } from "./components/PANOCRScreen";
import { SignatureScreen } from "./components/SignatureScreen";
import { VoiceFormFilling } from "./components/VoiceFormFilling";
import { FraudDetectionScreen } from "./components/FraudDetectionScreen";
import { RiskScoringScreen } from "./components/RiskScoringScreen";
import { UserConfirmationScreen } from "./components/UserConfirmationScreen";
import { VerificationSuccess } from "./components/VerificationSuccess";
import { VerificationFailure } from "./components/VerificationFailure";
import { Dashboard } from "./components/Dashboard";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: LoginConsent,
  },
  {
    path: "/liveness",
    Component: LivenessModule,
  },
  {
    path: "/pan-ocr",
    Component: PANOCRScreen,
  },
  {
    path: "/signature",
    Component: SignatureScreen,
  },
  {
    path: "/voice-form",
    Component: VoiceFormFilling,
  },
  {
    path: "/fraud-detection",
    Component: FraudDetectionScreen,
  },
  {
    path: "/risk-scoring",
    Component: RiskScoringScreen,
  },
  {
    path: "/confirmation",
    Component: UserConfirmationScreen,
  },
  {
    path: "/success",
    Component: VerificationSuccess,
  },
  {
    path: "/failure",
    Component: VerificationFailure,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },

]);
