import Axios from 'axios';
import { AssessmentUpdateDto, CandidateInsertDto, InputOutput, Status, } from '../../../types/Models';
import { DatabaseCode } from '../../../types/Util.types';
import { supabase } from '../../API/supabase';

export class CandidateAssessmenmtAPIService {

    static async create(payload: Pick<CandidateInsertDto, 'emailId' | 'name'> & { exam_id: number }) {
        const response = await supabase.from('candidate').insert({
            emailId: payload.emailId,
            name: payload.name,
        }).select();
        const { error } = response;
        let candidateData = response.data;
        if (error?.code === DatabaseCode.ALREADY_EXISTS) {
            const { data, error } = await supabase.from('candidate').select().eq('emailId', payload.emailId);
            if (error) {
                throw error;
            }
            candidateData = data
        }
        else if (error) {
            throw error;
        }
        const candidate = candidateData?.[0]
        if (candidate) {
            const { data: assessmentData, error: assessmentError } = await supabase.from('assessment').insert({
                exam_id: payload.exam_id,
                candidate_id: candidate.id,
                joinedAt: new Date().toISOString(),
                status: Status.JOINED,
            }).select();
            if (assessmentError) {
                throw assessmentError;
            }
            return assessmentData?.[0];
        }
    }

    static async runCode(code: string, language_id: string,) {
        const response = await Axios.post(import.meta.env.VITE_COMPILER_ENDPOINT || '', {
            source_code: code,
            language_id,
        });
        return response.data;
    }

    static async runTestCases(code: string, language_id: string, assessment_id: number, challenge_id: number) {
        const { data: assessmentData, error: assessmentError } = await supabase
            .from('assessment')
            .select(`*,
            challenge(*)`).eq('id', assessment_id).eq('challenge_id', challenge_id);
        if (assessmentError) {
            throw assessmentError;
        }
        const assessment = assessmentData?.[0];
        const input_output = assessment?.challenge[0]?.input_output as unknown as InputOutput;

        input_output.inputOutput.forEach(async ({ input, output }) => {
            const response = await Axios.post(import.meta.env.VITE_COMPILER_ENDPOINT || '', {
                source_code: code,
                language_id,
            });
        });
    }

    static async submit(payload: Pick<AssessmentUpdateDto, 'code' | 'language' | 'id'>) {
        const { data, error } = await supabase.from('assessment').update({
            ...payload,
            status: Status.SUBMITTED,
        }).eq('id', payload.id).select();
        if (error) {
            throw error;
        }
        return data?.[0];
    }

}