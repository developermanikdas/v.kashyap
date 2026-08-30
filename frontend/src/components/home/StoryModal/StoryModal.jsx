import Modal from "../../common/Modal/Modal";
import Button from "../../common/Button/Button";
import styles from "./StoryModal.module.css";

const StoryModal = ({ story, isOpen, onClose }) => {
  if (!story) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={story.title}
      size="lg"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Archive Entry
        </Button>
      }
    >
      <div className={styles.meta}>
        <span className={styles.date}>{story.date || "Archive Reflection"}</span>
        <span className={styles.tag}>Reflection</span>
      </div>

      <div className={styles.content}>
        <p>{story.story}</p>
      </div>

      <div className={styles.divider} />
      <p className={styles.reflection}>
        &ldquo;Some moments are valuable simply because they happened naturally.&rdquo;
      </p>
    </Modal>
  );
};

export default StoryModal;
