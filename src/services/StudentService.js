import React from 'react';
import { allStages, feedbackableStages, feedbackableStagesData, permissions } from '../config';
import Moment from 'react-moment';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import StageSelect from '../components/StageSelect';
import OwnerSelect from '../components/OwnerSelect';
import StatusSelect from '../components/StatusSelect'
import StudentFeedback from '../components/FeedbackPage';
import StageTransitions from '../components/StageTransitions';
import StageTransitionsStudentStatus from '../components/StageTransitionsStudentStatus';
import AudioRecorder from '../components/audioRecording';
import AudiofileUpload from '../components/ulpoadAudioFile';

const _ = require('underscore');
const animatedComponents = makeAnimated();

const allStagesOptions = Object.keys(allStages).map(x => { return allStages[x] });

const ColumnTransitions = {
  name: "id",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, rowMeta) => {
      return <StageTransitions
        studentId={value}
        studentName={rowMeta.rowData[2]}
        dataType={'columnTransition'}
      />
    }
  }
}

const setColumn = {
  name: "SetName",
  label: "Set",
  options: {
    filter: false,
    sort: true,
    display: false
  }
}

const nameColumn = {
  name: "name",
  label: "Name",
  options: {
    filter: true,
    sort: true,
    filterType: 'textField'
  }
}

const cityColumn = {
  name: "city",
  label: "City",
  options: {
    filter: false,
    sort: true,
    display: false
  }
}

const stateColumn = {
  name: "state",
  label: "State",
  options: {
    filter: false,
    sort: true,
    display: false
  }
}

const numberColumn = {
  name: "number",
  label: "Number",
  options: {
    filter: false,
    sort: true,
  }
}

const marksColumn = {
  name: "marks",
  label: "Marks",
  options: {
    filter: false,
    sort: true,
  }
}

const genderColumn = {
  name: "gender",
  label: "Gender",
  options: {
    filter: true,
    sort: true,
  }
}

const stageColumn = {
  name: "stage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    filterOptions: allStagesOptions,
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(rowMeta.rowData[15]) > -1) {
        return <StageSelect
          allStagesOptions={allStagesOptions}
          rowMetatable={rowMeta}
          stage={value}
          allStages={allStages}
          change={event => updateValue(event)}
        />
      } else {
        return value;
      }
    }
  }
}

const addedAtColumn = {
  name: "createdAt",
  label: "When?",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value) => {
      return <Moment format="D MMM YYYY" withTitle>{value}</Moment>
    }
  }
}

const lastUpdatedColumn = {
  name: "lastUpdated",
  label: "Last Updated",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value) => {
      return <Moment format="D MMM YYYY" withTitle>{value}</Moment>
    }

  }
}

const loggedInUserColumn = {
  name: 'loggedInUser',
  label: "Logged In User",
  options: {
    filter: false,
    sort: true,
    display: false,
  }
}

const deadlineColumn = {
  name: 'deadline',
  label: "Deadline",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (rowData, rowMeta) => {
      if (rowData) {
        const studentStage = (_.invert(allStages))[rowMeta.rowData[8]];
        const deadline = feedbackableStagesData[studentStage].deadline;
        const diff = new Date().getTime() - new Date(rowData).getTime()
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainingTime = deadline - hours;
        if (rowMeta.rowData[17]) {
          return null;
        }
        if (remainingTime < 0) {
          return <p style={{ color: "#FF0000	", letterSpacing: "1px" }}> Your deadline is <b>fineshed</b> please do this work ASAP.</p>
        }
        else if (deadline === 60 && remainingTime < 20) {
          return <p style={{ color: "#f9a800", letterSpacing: "1px" }}> <b>{remainingTime}</b> Hours remaining.</p>
        }
        else if (deadline === 48 && remainingTime < 15) {
          return <p style={{ color: "#f9a800", letterSpacing: "1px" }}> <b>{remainingTime}</b> Hours remaining.</p>
        }
        else if (deadline === 24 && remainingTime < 6) {
          return <p style={{ color: "#f9a800", letterSpacing: "1px" }}> <b>{remainingTime}</b> Hours remaining.</p>
        }
        else {
          return <p style={{ color: "green", letterSpacing: "1px" }}> <b>{remainingTime}</b>  Hours remaining. </p>
        }
      }
    }
  }
}

const stausColumn = {
  name: 'status',
  label: "Status",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (state) => {
      if (state) {
        return (state.charAt(0).toUpperCase() + state.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
      }
    }
  }
}
const stageColumnTransition = {
  name: "toStage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    customBodyRender: (rowData) => {
      return allStages[rowData];
    }
  }
}

const feedbackColumnTransition = {
  name: "feedback",
  label: "Feedback",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFeedback = rowData || feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return <div>
        {
          ifExistingFeedback ?
            <div>
              <StudentFeedback
                rowMetaTable={rowMeta}
                feedback={rowData}
                change={event => updateValue(event)}
              />
              {rowData ? rowData.split('\n\n').map((item, i) => <p key={i}> {item} </p>) : null}
            </div>
            : null
        }
      </div>
    }
  }
}

const ownerColumnTransition = {
  name: "toAssign",
  label: "Owner",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFeedback = feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return <div>
        {
          ifExistingFeedback ?
            <OwnerSelect
              rowMetaTable={rowMeta}
              value={rowData}
              change={event => updateValue(event)}
            /> : null
        }
      </div>
    }
  }
}
const statusColumnTransition = {
  name: "state",
  label: "Status",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      if (rowData || rowMeta.rowData[3]) {
        return <div>
          <StatusSelect
            feedbackableStagesData={feedbackableStagesData}
            rowMetaTable={rowMeta}
            state={rowData}
            change={event => updateValue(event)}
          />
        </div>

      }
      return null;
    }
  }
}

const timeColumnTransition = {
  name: 'studentId',
  label: 'Time',
  options: {
    filter: false,
    display: false,
  }
}

const deadlineColumnTrnasition = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingDeadlineDate = rowData && !rowMeta.rowData[7];
      if (ifExistingDeadlineDate) {
        const deadline = feedbackableStagesData[rowMeta.rowData[0]].deadline;
        const diff = new Date().getTime() - new Date(rowData).getTime()
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainingTime = deadline - hours;
        if (remainingTime < 0 && !rowMeta.rowData[7]) {
          return "Your deadline is fineshed please do this work ASAP."
        } else if (!rowMeta.rowData[2]) {
          return <p> <b>{remainingTime}</b> Hours are remaining.</p>
        }
        return null;
      }
    }
  }
}

const finishedColumnTransition = {
  name: "finishedAt",
  label: "Finished",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFinishedDate = rowData;
      return ifExistingFinishedDate ? <Moment format="D MMM YYYY" withTitle>{rowData}</Moment> : null;
    },
  }
}

const loggedInUser = {
  name: 'loggedInUser',
  label: "LoggedIn User",
  options: {
    filter: false,
    display: false,
    customBodyRender: (rowData) => {
      return rowData.user_name
    }
  }
}

const AudioPlayer = {
  name: "audioRecording",
  label: "Audio Recording",
  options: {
    filter: false,
    display: true,
    customBodyRender: (value, rowMeta, updateValue) => {
      const ifExistingFeedback = rowMeta.rowData[2] || feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return (
        <div>
          {ifExistingFeedback && value ? 
            <AudioRecorder
              audioUrl={value} /> : null
          }
          {ifExistingFeedback && !value ?
            <AudiofileUpload
              studentId={rowMeta.rowData[5]}
              userId={rowMeta.rowData[8].id}
              student_stage={rowMeta.rowData[0]}
              change={event => updateValue(event)}
              columnIndex={rowMeta.columnIndex} /> : null
          }
        </div>
      )
    }
  }
}

const StageColumnMyreport = {
  label: 'Stage',
  name: 'student_stage',
  options: {
    filter: true,
    sort: true,
  }
}

const feedbackColumnMyreport = {
  label: 'Feedback',
  name: 'feedback',
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData) => {
      return rowData ? rowData.split('\n\n').map((item, i) => <p key={i}> {item} </p>) : null;
    }
  }
}

const stausColumnMyreport = {
  label: 'Status',
  name: 'state',
  options: {
    filter: false,
  }
}

const ownerColumnMyreport = {
  label: 'Owner',
  name: 'toAssign',
  options: {
    filter: true,
  }
}

const assignDateColumnMyreport = {
  label: 'AssignDate',
  name: 'createdAt',
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return <Moment format="D MMM YYYY" withTitle>{rowData}</Moment>
    }
  }
}

const StageColumnDanglingReport = {
  label: 'Stage',
  name: 'stage'
}

const TotalFemaleDanglingReport = {
  label: 'Female',
  name: 'female',
  options: {
    filter: false
  }
}

const TotalmaleDanglingReport = {
  label: 'Male',
  name: 'male',
  options: {
    filter: false
  }
}

const TotalTransDanglingReport = {
  label: 'Transgender',
  name: 'transgender',
  options: {
    filter: false
  }
}

const TotalUnspecifiedDanglingReport = {
  label: 'Unspecified',
  name: 'unspecified',
  options: {
    filter: false
  }
}

const TotalDanglingReport = {
  label: 'Total Dangling',
  name: 'total',
  options: {
    filter: false
  }
}

const EmailColumn = {
  label: 'Email',
  name: 'email',
  options: {
    filter: false,
    display: false,
  }
}

const QualificationColumn = {
  label: 'Qualification',
  name: 'qualification',
  options: {
    filter: false,
    display: false,
  }
}

const ReligonColumn = {
  label: 'Religon',
  name: 'religon',
  options: {
    filter: false,
    display: false,
  }
}

const CasteColumn = {
  label: 'Caste',
  name: 'caste',
  options: {
    filter: false,
    display: false,
  }
}

const lastStageColumn = {
  label: 'Last Stage',
  name: 'fromStage',
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return allStages[rowData]
    }
  }
}

const linkForEnglishTestColumn = {
  label: 'English Test Link',
  name: 'linkForEnglishTest',
}

const linkForOnlineTestColumn = {
  label: 'Online Test Link',
  name: 'linkForOnlineTest',
  options: {
    customBodyRender: (value) => {
      return value ? <a target="_blank" href={value}>Link to Test</a> : null;
    }
  }
}

const stageColumnStatus = {
  label: 'Current Stage',
  name: 'toStage',
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return allStages[rowData]
    }
  }
}
const cityColumnStatus = {
  label: "City",
  name: 'city'
}

const stateColumnStatus = {
  label: "State",
  name: 'state',
}

const ColumnTransitionsStatus = {
  name: "transitions",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value) => {
      return <StageTransitionsStudentStatus
        rowData={value}
        allStages={allStages}
      />
    }
  }
}

const partnerNameColumn = {
  label: "Partner Name",
  name: "partnerName",
}
const StudentService = {
  columns: {
    requestCallback: [
      ColumnTransitions,
      numberColumn,
      addedAtColumn,
      lastUpdatedColumn,
    ],
    softwareCourse: [
      ColumnTransitions,
      setColumn,
      nameColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      marksColumn,
      genderColumn,
      stageColumn,
      addedAtColumn,
      lastUpdatedColumn,
      EmailColumn,
      QualificationColumn,
      ReligonColumn,
      CasteColumn,
      loggedInUserColumn,
      ownerColumnMyreport,
      stausColumn,
      deadlineColumn,
      partnerNameColumn
    ],
    columnTransition: [
      stageColumnTransition,
      addedAtColumn,
      feedbackColumnTransition,
      ownerColumnTransition,
      statusColumnTransition,
      timeColumnTransition,
      deadlineColumnTrnasition,
      finishedColumnTransition,
      loggedInUser,
      AudioPlayer
    ],
    columnStudentStatus: [
      ColumnTransitionsStatus,
      nameColumn,
      cityColumnStatus,
      stateColumnStatus,
      marksColumn,
      genderColumn,
      stageColumnStatus,
      lastStageColumn,
      linkForEnglishTestColumn,
      linkForOnlineTestColumn
    ]
  },
  columnMyReports: [
    nameColumn,
    StageColumnMyreport,
    feedbackColumnMyreport,
    stausColumnMyreport,
    ownerColumnMyreport,
    assignDateColumnMyreport
  ],

  columnDanglingReports: [
    StageColumnDanglingReport,
    TotalFemaleDanglingReport,
    TotalmaleDanglingReport,
    TotalTransDanglingReport,
    TotalUnspecifiedDanglingReport,
    TotalDanglingReport
  ],



  dConvert: (x) => {
    try {
      x.number = x['contacts'][0]['mobile'];
    } catch (e) {
      x.number = null;
    }

    x.gender = x.gender == 1 ? 'Female' : 'Male';
    x.stage = allStages[x.stage];
    x.marks = x.enrolmentKey[0] ? parseInt(x.enrolmentKey[0].totalMarks, 10) : null;
    x.marks = isNaN(x.marks) ? null : x.marks;
    x.lastUpdated = x.lastTransition ? x.lastTransition.createdAt : null;
    return x
  },

  addOptions: (columns, dataRow) => {
    return columns.map((column) => {
      if ('selectFilter' in column) {
        if (column.options.indexOf(dataRow[column.field]) == -1) {
          column.options.push(dataRow[column.field])
        }
      }
      return column
    })
  }
}

export default StudentService;