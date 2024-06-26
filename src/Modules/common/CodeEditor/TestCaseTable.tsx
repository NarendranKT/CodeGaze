import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';
import { Challenge } from '../../../types/Models';
import { ColumnsType } from 'antd/es/table';
interface ITestCaseProps {
    result: boolean[];
    input_output: Challenge['input_output'];
    showOnlyFirstTwoTestCases?: boolean;
}

const TestCaseTable = ({ result, input_output, showOnlyFirstTwoTestCases = true }: ITestCaseProps) => {

    const testCaseResult = input_output.inputOutput.map((inputOutput, index) => {
        return {
            key: index,
            input: inputOutput.input,
            expected: inputOutput.output,
            result: result[index] ? 'Passed' : 'Failed',
        };
    });

    const colDef: ColumnsType<any> = [
        {
            title: 'Input',
            dataIndex: 'input',
            key: 'input',
            render: (inputs: string[], record, index) =>
                !showOnlyFirstTwoTestCases || index < 2 ? (
                    <div>
                        {inputs.map((input, index) => (
                            <Tag key={index}>{input}</Tag>
                        ))}
                    </div>
                ) : (
                    <div className="blur-test-case">Hidden</div>
                ),
        },
        {
            title: 'Expected',
            dataIndex: 'expected',
            key: 'expected',
            render: (output: string, record, index) =>
                !showOnlyFirstTwoTestCases || index < 2 ? (
                    <div>
                        <Tag>{output}</Tag>
                    </div>
                ) : (
                    <div className="blur-test-case">Hidden</div>
                ),
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            fixed: 'right',
            width: 120,
            render: (value: string) => {
                if (value === '') {
                    return null;
                }
                if (result.length === 0) {
                    return '';
                }
                const isPass = value === 'Passed';
                const color = isPass ? 'green' : 'red';
                return (
                    <Tag icon={isPass ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={color}>
                        {value}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div
            style={{
                height: '28vh',
                overflowY: 'auto',
            }}
        >
            <div  className="test-case-table-container">
                <Table dataSource={testCaseResult} columns={colDef} pagination={false} />
            </div>
        </div>
    );
};

export default TestCaseTable;
