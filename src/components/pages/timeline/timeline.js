import React, { Component } from 'react';
import DriveHelper from '../../helpers/driveHelper';
import {CircularProgress, withStyles} from '@material-ui/core';
import TimelineCard  from '../../views/diaryEntries/timelineCard';
import Entry from '../entry/entry';
import PropTypes from 'prop-types';

class Timeline extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            fileCount: 0,
            diaryEntryCount: 0,
            isFileCountDone: false,

            // View Single Diary Entry
            viewSingleEntry: false,
            singleEntryFileName: '',
            singleEntryTimelineCardIndex:'',
            singleEntryTitle:'',
            singleEntryDate:'',
            singleEntryMood:'',
            singleEntryWeather:'',
            singleEntryBodyText:'',
            singleEntryTodos: [],
            singleEntryTallies: '',
        }
        this.viewSingleEntry = this.viewSingleEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.viewTimeline = this.viewTimeline.bind(this);
        this.eachDiaryEntryObject = this.eachDiaryEntryObject.bind(this);
    }

    viewSingleEntry(fileName, timelineCardIndex, title, date, mood, weather, bodyText, todos, tallies) {
        this.setState({
            viewSingleEntry: true,
            singleEntryFileName: fileName,
            singleEntryTimelineCardIndex: timelineCardIndex,
            singleEntryTitle: title,
            singleEntryDate: date,
            singleEntryMood: mood,
            singleEntryWeather: weather,
            singleEntryBodyText: bodyText,
            singleEntryTodos: todos,
            singleEntryTallies: tallies,
        });
    }

    deleteEntry(fileName, timelineCardIndex) {
        this.props.diaryEntryStore.entries.splice(timelineCardIndex, 1);
        DriveHelper.updateFile(fileName, {'deleted': true});
    }

    viewTimeline(){
        DriveHelper.readFile(this.state.singleEntryFileName).then((entry) => {
            const fileName = this.props.diaryEntryStore.entries[this.state.singleEntryTimelineCardIndex].fileName;
            entry.fileName = fileName;
            this.props.diaryEntryStore.entries[this.state.singleEntryTimelineCardIndex] = entry;

            this.setState({
                viewSingleEntry: false,
                singleEntryFileName: '',
                singleEntryTimelineCardIndex:'',
                singleEntryTitle:'',
                singleEntryDate:'',
                singleEntryMood:'',
                singleEntryWeather:'',
                singleEntryBodyText:'',
                singleEntryTodos: [],
                singleEntryTallies: '',
            }); 
        });
    }

    componentDidMount() {
        DriveHelper.getFileCount().then((count) => {

            if(this.props.diaryEntryStore.entries.length === count - 1 && (count - 1) > 0) {
                // Diary entries already previously loaded and stored into diary entry store
                this.setState({
                    fileCount: count, 
                    isFileCountDone: true,
                })
            } else if(count > 1) {
                for(let i = count - 1 ; i > 0; i--) {
                    DriveHelper.readFile(i).then((entry) => {
                        entry.fileName=i;
                        if(!entry.deleted) {
                            this.props.diaryEntryStore.entries.push(entry);
                        }
                        this.setState({
                            fileCount: count,
                            diaryEntryCount: this.props.diaryEntryStore.entries.length,
                            isFileCountDone: true, 
                        })
                    }).catch(err => console.log(err))
                }
            } else {
                this.setState({
                    isFileCountDone: true,
                });
            }
        })
    }

    eachDiaryEntryObject(diaryEntry, i) {
        const entry = diaryEntry;
        const { classes } = this.props;
        return (
            <div className={classes.timelineCard}>
            <TimelineCard 
                fileName={entry.fileName}
                title={entry.title}
                date={entry.date}
                mood={entry.mood}
                weather={entry.weather}
                bodyText={entry.bodyText}
                todos={entry.todos}
                tallies={entry.tallies}
                birthDate={this.props.userStore.preferences.dateOfBirth}
                index={i}
                viewSingleEntry={this.viewSingleEntry}
                deleteEntry={this.deleteEntry}
            />
            </div>
        );
    }

    render() {
        const { classes } = this.props;

        if(this.state.viewSingleEntry) {
            return (
                <Entry 
                    adding={false}
                    fileName={this.state.singleEntryFileName}
                    index={this.state.singleEntryTimelineCardIndex}
                    title={this.state.singleEntryTitle}
                    date={this.state.singleEntryDate}
                    mood={this.state.singleEntryMood}
                    weather={this.state.singleEntryWeather}
                    bodyText={this.state.singleEntryBodyText}
                    todos={this.state.singleEntryTodos}
                    tallies={this.state.singleEntryTallies}
                    userStore={this.props.userStore}
                    back={this.viewTimeline}
                /> 
            );
        } else {
            if(this.state.fileCount > 0 && this.state.diaryEntryCount > 0) {
                return(<div>{this.props.diaryEntryStore.entries.map(this.eachDiaryEntryObject)}</div>);
            } else if(this.state.fileCount > 0 && this.state.diaryEntryCount === 0) {
                return(<div className={classes.centerText}><i>There are no diary entries to show. It's empty here....</i></div>);
            } else {
                return(<div className={classes.circularProgress}><CircularProgress /></div>);
            }
        }
    }
}

const styles = theme => ({
    circularProgress: {
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
    }, 
    centerText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
    }, 
    timelineCard: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 25, 
        minWidth: 275,
        maxWidth: 575,
    },
});

Timeline.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Timeline);
