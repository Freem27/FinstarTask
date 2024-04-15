import { InputNumber, Modal } from "antd";
import { useState } from "react";

interface Props {
  onConfirm: (v: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}
export default function PromptNumberModal ({ open, setOpen, onConfirm } : Props) {
  
  const [value, setValue] = useState(50);
  
  const onOk = () => {
    onConfirm(value)
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="Modal"
        open={open}
        onOk={onOk}
        onCancel={() => setOpen(false)}
        okText="Ок"
        cancelText="Отмена"
      >
        <InputNumber min={1} max={1000} value={value} onChange={e => setValue(e ?? 1)} />
      </Modal>
    </>
  );
}