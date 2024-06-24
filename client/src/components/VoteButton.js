import React, { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

class Upvote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.initialCount || 2,
            userVote: null, // Track user's vote
        };
    }

    componentDidMount() {
        const { commentId } = this.props;
        this.fetchUserVote(commentId);
    }

    fetchUserVote = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:4000/comments/${commentId}`);
            const data = await response.json();
            const userVote = data.voters.find(voter => voter.userId === this.props.userId)?.vote || null;
            this.setState({ userVote, count: data.upVote });
        } catch (error) {
            console.error('Error fetching user vote:', error);
        }
    }

    updateVote = async (vote) => {
        const { commentId, userId } = this.props;
        let newCount = this.state.count;

       

            // User is changing or setting their vote
            if (this.state.userVote !== null) {
                // If user had already voted, adjust count to reflect change
                if(this.state.userVote === -1){
                    newCount += 1;
                } else if(this.state.userVote === 1){
                    newCount -= 1;
                }
                newCount -= this.state.userVote;
                console.log(this.state.userVote);
                console.log(newCount);
            }
        

        try {
            const response = await fetch(`http://localhost:4000/comments/${commentId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, vote }),
            });

            if (response.ok) {
                this.setState({ count: newCount, userVote: vote === 0 ? null : vote });
            } else {
                const data = await response.json();
                console.error('Failed to update vote:', data);
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };
    
    handleVote = (vote) => {
        if (this.state.userVote === vote) {
            // If the user has already voted this way, retract their vote
            this.updateVote(0);
        } else {
            // If the user hasn't voted yet, add their vote
            console.log('Update Vote');
            this.updateVote(vote);
        }
    };

    render() {
        return (
            <div className='vote-button'>
                <button onClick={() => this.handleVote(1)} disabled={this.state.userVote === 1}>
                    +
                </button>
                <span>{this.state.count}</span>
                <button onClick={() => this.handleVote(-1)} disabled={this.state.userVote === -1}>
                    -
                </button>
            </div>
        );
    }
}

export default function UpvoteWithUser(props) {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkUserStatus() {
            try {
                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        checkUserStatus();
    }, [setUserInfo]);

    const handleVoteClick = () => {
        console.log('test')
        if (!userInfo || userInfo.message === 'Unauthorized') {
            alert('Must be logged in to vote on a comment');
            navigate('/login');
        }
    };
    
    return (
        <Upvote {...props} userId={userInfo._id} onClick={handleVoteClick} />
    );
}
