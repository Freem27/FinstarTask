import { Button, Flex, Form, Popconfirm, Space } from "antd"
import { FinstarRow, FinstarRowSource, NewFinstarRow } from "../types/FinstarDataTypes"
import { PagedResult } from "../types/PagedResult"
import TextArea from "antd/es/input/TextArea";
import { FinstarDataServie } from "../services/FinstarDataService";
import { useState } from "react";
import PromptNumberModal from "./PromptNumberModal";

interface Props {
  pageSize: number;
  onDataInserted: (page: PagedResult<FinstarRow>) => void;
}

const MAX_TEXT_LENGTH = 10000;
interface FormData {
  text: string;
}
export default function InsertDataPart({ pageSize, onDataInserted } : Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<FormData>();
  const [isPromptNumberModalVisible, setPromptNumberModalVisible] = useState(false);
  
  const submit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const items = TryParseFinstarRows(data.text);
      if (items) {
        const resp = await FinstarDataServie.TruncateAndInsert(items, pageSize);
        if (resp) {
          onDataInserted(resp);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inserNewData = (count: number) => {
    const newData = RenderTestData(count);
    console.log(newData)
    form.setFieldValue('text', JSON.stringify(newData, null, 2).substring(0, MAX_TEXT_LENGTH))
  }

  const validateText = (text: string) => {
    text = text.trim();
    if (!text) {
      return Promise.reject('Введите значение');
    }
    if (text.length === MAX_TEXT_LENGTH && text[text.length - 1] !== ']') {
      return Promise.reject(`Максимальная длина данных ${MAX_TEXT_LENGTH} символов. Похоже, массив был обрезан.`)
    }
    if (!TryParseFinstarRows(text)){
      return Promise.reject("Данные имеют некорректный формат")
    }

    return Promise.resolve();
  }

  return(<>
    <Form 
      form={form}
      onFinish={submit}
      disabled={isLoading}
      initialValues={{text: '[{"1": "value1"},{"5": "value2"},{"10": "value32"}]'}}
    >
      <Form.Item label='Введите данные' name={'text'} tooltip={`Не более ${MAX_TEXT_LENGTH} символов`} rules={[{validator: (_, v) => validateText(v)}]}>
        <TextArea rows={20} maxLength={MAX_TEXT_LENGTH} placeholder='[{"1": "value1"},{"5": "value2"},{"10": "value32"}]'/>
      </Form.Item>
      <Flex justify="flex-end">
        <Space>
          <Button onClick={() => setPromptNumberModalVisible(true)}>Сгенерировать строки</Button>
          <Popconfirm
            title="Внимание!"
            description="Вставка полностью удалить все имеющиеся данные. Продолжить?"
            placement="topRight"
            onConfirm={() => form.submit()}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="primary">Вставить</Button>
          </Popconfirm>
        </Space>
      </Flex>
    </Form>
    <PromptNumberModal open={isPromptNumberModalVisible} setOpen={setPromptNumberModalVisible} onConfirm={inserNewData} />
  </>)
}

const TryParseFinstarRows = (source: string): NewFinstarRow[] | undefined => {
  try {
    const parsed =  JSON.parse(source) as FinstarRowSource[];
    const result: NewFinstarRow[] = parsed.map(p => ({code: Number.parseInt(Object.keys(p)[0]), value: String(Object.values(p)[0])}));
    return result;
  } catch {
    return undefined;
  }
}

const RenderTestData = (count: number): FinstarRowSource[] => {
  return new Array(count).fill(null).map(v => {
    const item: FinstarRowSource = {
      [randomIntFromInterval(0, 1000) + v]: RandomString()
    }
    return item;
  })
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function RandomString() {
  return (Math.random() + 1).toString(36).substring(7);
}