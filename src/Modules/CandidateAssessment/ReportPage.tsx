import React, { useEffect, useState } from 'react';
import { AssessmentQueryResult } from '../Dashboard/Dashboard';
import { Card, Col, Row, Skeleton, Tag } from 'antd';
import { Language, languagesNameMap } from '../common/CodeEditor/ProgrammingLanguages';
import TestCaseTable from '../common/CodeEditor/TestCaseTable';
import { InputOutput } from '../../types/Models';
import { useLocation, useParams } from 'react-router';
import { CandidateAssessmentAPIService } from './services/CandidateAssessment.API';
import CandidateAssessmentUtils from './services/CanidadateAssessment.utils';
import { QUALIFYING_SCORE } from '../../constants/common.constants';
import dayjs from 'dayjs';
import QuestionContent from '../common/CodeEditor/QuestionContent';
import Editor from '../common/CodeEditor/Editor'
import {  Challenge } from '../../types/Models';
import CodeMirror from '@uiw/react-codemirror';

const ReportPage: React.FC = () => {
    const state = useLocation().state;
    const assessmentFromLocation = state?.assessment as AssessmentQueryResult[number];
    const [assessment, setAssessment] = useState(assessmentFromLocation);
    const [loading, setLoading] = useState(true);
    // const language = languagesNameMap[assessment?.language] || languagesNameMap[Language.JAVASCRIPT];

    const { assessmentId } = useParams<{ assessmentId: string }>();

    useEffect(() => {
        if (!assessmentFromLocation && assessmentId) {
            CandidateAssessmentAPIService.getById(assessmentId)
                .then((data) => {
                    setAssessment(data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [assessmentFromLocation, assessmentId]);

    const score = CandidateAssessmentUtils.getScore(assessment);

    const challenge : Challenge = {
        created_at: assessment.challenge.created_at,
        description: assessment.challenge.description,
        difficulty: assessment.challenge.difficulty,
        id: assessment.challenge.id,
        input_output: assessment?.challenge?.input_output as unknown as InputOutput,
        name: assessment?.challenge?.name,
        short_description: assessment?.challenge?.short_description,
    }




    return (
        <div style={{ padding: '24px' }}>
            {loading ? (
                <Skeleton />
            ) : (
            <>    
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card>
                            <p>
                                <b>Name:</b> {assessment?.candidate?.name}
                            </p>
                            <p>
                                <b>Email:</b> {assessment?.candidate?.emailId}
                            </p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <p>
                                <b>Time Taken:</b> {CandidateAssessmentUtils.getTimeTaken(assessment)}
                            </p>
                            <p>
                                <b>Score: </b>
                                <Tag color={score > QUALIFYING_SCORE ? 'green' : 'red'}>{score}%</Tag>
                            </p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <p>
                                <b>Started:</b> {dayjs(assessment?.created_at).format('h:mm A MMM DD, YYYY')}
                            </p>
                            <p>
                                <b>Finished:</b>{' '}
                                {assessment?.finished
                                    ? dayjs(assessment?.finished).format('h:mm A MMM DD, YYYY')
                                    : 'Not Finished'}
                            </p>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <p>
                                <b>Exam:</b> {assessment?.exam?.name}
                            </p>
                            <p>
                                <b>Challenge:</b> {assessment?.challenge?.name}
                            </p>
                        </Card>
                    </Col>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title={assessment?.challenge?.name}>
                                <QuestionContent
                                    challenge={assessment?.challenge}
                                    hideTitle={true}
                                    editorStyles={{
                                        height: '200px',
                                        overflowY: 'auto',
                                        width: `calc(100vw - 7.5rem)`,
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card >
                                <TestCaseTable
                                    input_output={
                                        (assessment?.challenge?.input_output as unknown as InputOutput) || {
                                            inputOutput: [],
                                            inputType: [],
                                            outputType: null,
                                        }
                                    }
                                    result={(assessment?.result as boolean[]) ?? []}
                                    showOnlyFirstTwoTestCases={false}
                                />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card>
                            <Editor 
                                assessment={assessment} 
                                challenge={challenge} 
                                candidate={assessment.candidate} 
                                isReportPage={true} 
                            />
                            </Card>
                        </Col>
                    </Row>
                </Row>
                  
            </>
            )}
        </div>
    );
};

export default ReportPage;
