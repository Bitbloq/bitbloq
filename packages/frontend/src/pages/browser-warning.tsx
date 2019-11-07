import BrowserVersionWarning from "../components/BrowserVersionWarning";
import { minChromeVersion } from "../config";

const BrowserWarningPage = () => {
  return <BrowserVersionWarning version={minChromeVersion} />;
};

export default BrowserWarningPage;
