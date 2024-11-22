import React from "react";
import { useLocation } from "react-router-dom";
import HeaderLayout from "../../components/HeaderLayout";

const SubsSuccess = () => {
  const location = useLocation();
  const { ack_no } = location.state || {};

  return (
    <HeaderLayout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="text-center mb-4">
              CORS Services Subscription Plan!
            </h2>
            <div className="card p-4 success-card alert alert-success my-4">
              <div className="align-items-center">
                <div className="text-center">
                  <span
                    className="check-icon text-success"
                    style={{ fontSize: "5rem" }}
                  >
                    &#10003;
                  </span>
                  <h4>Submitted Successfully!</h4>
                  <p className="mb-0">
                    Your order for the purchase of CORS Product Services has
                    been submitted successfully. The order Acknowledgement
                    Number is <strong>{ack_no}</strong>. Please Keep this number
                    for future correspondence. On successful verification of
                    payment details,your subscription will be activated within
                    24 working hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default SubsSuccess;

"make Ui in react js and bootstrap-5 only where user can pay amount using card,upi and net banking"