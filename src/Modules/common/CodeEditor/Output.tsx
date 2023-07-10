import classes from './Editor.module.css';
import { Button } from 'antd';

interface OutputProps {
    output: string;
    handleRun: () => void;
    handleSubmit: () => void;
}

const Output = (props: OutputProps) => {
    return (
        <div className={`${classes.content} ${classes.pane3}`}>
            <div className={classes.buttonContainer}>
                <Button type="primary" style={{ margin: '1rem 0.5rem 1rem 0' }} onClick={props.handleRun}>
                    Run
                </Button>
                <Button type="primary" style={{ margin: '1rem 0.5rem 1rem 0' }} onClick={props.handleSubmit}>
                    Submit
                </Button>
                {/* <Button type="primary" style={{ margin: '1rem 0.5rem 1rem 0' }} onClick={props.handleSubmit}>
                    Submit
                </Button> */}
            </div>
            <div
                style={{
                    minHeight: 100,
                    border: '1px solid #d9d9d9',
                    padding: 8,
                }}
            >
                {props.output}
            </div>
        </div>
    );
};

export default Output;
