import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MessageHero from "../components/message/MessageHero";
import ShowMessageCards from "../components/message/ShowMessageCards";
import ReviewButton from "../components/message/ReviewButton";
import ReviewModal from "../components/message/ReviewModal";
import FinalConfirmation from "../components/message/FinalConfirmation";
import ExperienceModal from "../components/message/ExperienceModal";

import { experienceInfo } from "../data/experienceInfo";

const Message = () => {
  const navigate = useNavigate();

  const [selectedExperience, setSelectedExperience] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-[#FAF9FF]">
        <MessageHero />

        <ShowMessageCards
          onCardClick={(type) => setSelectedExperience(type)}
        />

        <ReviewButton
          onClick={() => setShowReviewModal(true)}
        />
      </main>

      {/* Experience Modal */}

      <ExperienceModal
        open={selectedExperience !== null}
        experience={experienceInfo[selectedExperience]}
        onClose={() => setSelectedExperience(null)}
        onStart={() => {
          navigate(`/message/${selectedExperience}`);
          setSelectedExperience(null);
        }}
      />

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

          // navigate("/animation");

          setShowConfirmation(false);
        }}
      />
    </>
  );
};

export default Message;