import { Eye } from "lucide-react";

const ReviewButton = ({ onClick }) => {
  return (
    <div className="flex justify-center py-10">
      <button
        onClick={onClick}
        className="
        group
        rounded-full
        bg-gradient-to-r
        from-violet-500
        via-fuchsia-500
        to-pink-500
        p-[2px]
        transition-all
        duration-300
        hover:scale-105
        "
      >
        <div
          className="
          flex
          items-center
          gap-3

          rounded-full

          bg-white

          px-7
          py-3
        "
        >
          <Eye
            size={18}
            className="text-violet-600"
          />

          <span className="font-medium">
            Review My Responses
          </span>
        </div>
      </button>
    </div>
  );
};

export default ReviewButton;