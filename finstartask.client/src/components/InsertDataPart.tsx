import { Button, Flex, Form, Space } from "antd"
import { FinstarRow, FinstarRowSource, NewFinstarRow } from "../types/FinstarDataTypes"
import { PagedResult } from "../types/PagedResult"
import TextArea from "antd/es/input/TextArea";
import { FinstarDataServie } from "../services/FinstarDataService";
import { useState } from "react";
import PromptNumberModal from "./PromptNumberModal";

interface Props {
  pageSize: number;
  setPage: (page: PagedResult<FinstarRow>) => void;
}
interface FormData {
  text: string;
}
export default function InsertDataPart({ pageSize, setPage} : Props) {
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
          setPage(resp);
        }
      }
    }finally {
      setIsLoading(false);
    }
  }

  const inserNewData = (count: number) => {
    const newData = RenderTestData(count);
    console.log(newData)
    form.setFieldValue('text', JSON.stringify(newData, null, 2))
  }

  return(<>
    <Form 
      form={form}
      onFinish={submit}
      disabled={isLoading}
      initialValues={{text: '[{"1": "value1"},{"5": "value2"},{"10": "value32"}]'}}
    >
      <Form.Item label='Введите данные' name={'text'}>
        <TextArea rows={20} />
      </Form.Item>
      <Flex justify="flex-end">
        <Space>
          <Button onClick={() => setPromptNumberModalVisible(true)}>Сгенерировать строки</Button>
          <Button type="primary" onClick={() => form.submit()}>Ok</Button>
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