import { useState, ChangeEvent, useMemo } from 'react';
import { Button, Table } from 'antd';
import { getChallengesColDef } from './ChallengeColumn';
import { Challenge } from '../../types/Models';
import Title from 'antd/es/typography/Title';
import Search from 'antd/es/input/Search';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { ChallengeResult } from './Challenges';

interface IChallengeTableProps {
    openForm: (values?: Challenge) => void;
    challenges: ChallengeResult;
    loading: boolean;
    refreshTable: () => void;
}
const ChallengeTable = ({ challenges, loading, openForm, refreshTable }: IChallengeTableProps) => {
    const [search, setsearch] = useState('');

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setsearch(value);
    };

    const filteredChallenges = useMemo(() => {
        return challenges.filter((challenge) => {
            return challenge.name?.toLowerCase().includes(search.toLowerCase());
        });
    }, [challenges, search]);

    const columnDef = getChallengesColDef(openForm, refreshTable);
    return (
        <div className="container">
            <Title level={2}>Challenges</Title>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Search
                    placeholder="Search Challenge"
                    style={{ width: 200, marginBottom: '10px' }}
                    onChange={handleSearch}
                />
                <Button
                    type="primary"
                    icon={<AppstoreAddOutlined />}
                    onClick={() => {
                        openForm();
                    }}
                >
                    Create Challenge
                </Button>
            </div>
            <Table rowKey="id" dataSource={filteredChallenges} columns={columnDef} size="small" pagination={false} loading={loading} />
        </div>
    );
};

export default ChallengeTable;
