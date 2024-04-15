import { Form, InputNumber, Modal } from "antd";
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
        title="Генерация данных для вставки"
        open={open}
        onOk={onOk}
        onCancel={() => setOpen(false)}
        okText="Ок"
        width={330}
        cancelText="Отмена"
      >
        <Form.Item label='Введите количество' tooltip='Значение от 1 до 1000' >
          <InputNumber min={1} max={1000} value={value} onChange={e => setValue(e ?? 1)} />
        </Form.Item>
      </Modal>
    </>
  );
}