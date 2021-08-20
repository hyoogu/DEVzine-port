const { findContributionsWithStatus } = require('./adminfunction/adminView');
const { checkCacheForContributions } = require('./cachefunction/contributionsCache')
const { Contribution } = require('../Models/Contributions')

module.exports = {

    adminSignin: async (req, res) => {
        
        return res.send('admin signin');

    },

	getAllUsersContribution: async (req, res) => {

        try {

            const postRequest = await findContributionsWithStatus(100);
            const patchRequest = await findContributionsWithStatus(101);
            const deleteRequest = await findContributionsWithStatus(102);
            
            let { contributionData } = await checkCacheForContributions();
            const accepted = contributionData.map(data => {
                return {
                    contribution_id: data.contribution_id,
                    contribution_title: data.contribution_title,
                    contribution_url: data.contribution_url,
                    status: data.status,
                    user_name: data.user_name
                }
            })
            
            return res.status(200).json(
                {
                    "data": {
                        "requested": {
                            postRequest,
                            patchRequest,
                            deleteRequest
                        },
                        accepted
                    },
                    "message" : "All contribution data success"
                }
            );

        } catch (err) {

            console.log(err);
            return res.status(500).send(err);

        }

	},

    rejectContribRequest: async (req, res) => {
        
        const { contribution_id, status } = req.body;

        try {

            const rejectedContribution = await Contribution.findOneAndUpdate(
                {
                    contribution_id
                }, {
                    $set: {
                        status: status + 20
                    }
                }, {
                    new: true
                }
            )

            if (!rejectedContribution) {

                return res.status(404).json(
                    {
                        "message": "Not found"
                    }
                );
            }

            return res.status(200).send('Update rejected');

        } catch (err) {

            console.log(err);
            return res.status(500).send(err);

        }

	},

    acceptContribRequest: async (req, res) => {

        //TODO: 사용자의 기고글 게시/수정/삭제 요청을 수락한다. 
        // body parameters
        // { 
        //     "contribution_id" : "string",
        //     "status" : "number"
        // }
        // status:200
        // {
        //     "message" : "Update success"
        // }
        // status:404
        // {   
        //     "message": "Not found"
        // }  
        return res.send('contribution request accepted');

    }   

};