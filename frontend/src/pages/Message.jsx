import { useState } from "react";

import MessageHero from "../components/message/MessageHero";
import ShowMessageCards from "../components/message/ShowMessageCards";
import ReviewButton from "../components/message/ReviewButton";
import ReviewModal from "../components/message/ReviewModal";
import FinalConfirmation from "../components/message/FinalConfirmation";

const Message = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-[#FAF9FF]">

        <MessageHero />

        <ShowMessageCards />

        <ReviewButton
          onClick={() => setShowReviewModal(true)}
        />

      </main>

      {/* Review Modal */}

      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}

        onContinue={() => {
          setShowReviewModal(false);

          setShowConfirmation(true);
        }}
      />

      {/* Final Confirmation */}

      <FinalConfirmation
        open={showConfirmation}

        onClose={() => setShowConfirmation(false)}

        onConfirm={() => {
          console.log("Wish Sent");

          // navigate("/animation")

          setShowConfirmation(false);
        }}
      />
    </>
  );
};

export default Message;