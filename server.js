const express = require("express");
const app = express();

const axios = require('axios');

const PORT = process.env.PORT || '4455';

app.use(express.json());

app.post('/Start-Process', async (request, response) => {
    let loanId = request.query.loanId;
    console.log("Loan Id: " + loanId);
    let businessKey = loanId;
    let body = {
        "businessKey": businessKey
    };

    // check if loanID already exists
    const res = await axios.get('http://localhost:8080/engine-rest/task?processInstanceBusinessKey=' + businessKey);
    if(res.data.length > 0){
        console.log("Process alread exist");
        console.log(res.status);
        console.log('Body: ', res.data);
        let temp = res.data[0];
        let responseTask = {
            id: temp.id,
            name: temp.name,
            loanId: loanId
        }
        response.json(responseTask);
    }
    else{
        // else create a new instance
        await axios.post('http://localhost:8080/engine-rest/process-definition/key/Parent_Process/start', body)
            .then((res) => {
                console.log(res.status);
                if (res.status == 200)
                    console.log("Process Started");
            }).catch((err) => {
                console.error(err);
            });

        await axios.get('http://localhost:8080/engine-rest/task?processInstanceBusinessKey=' + businessKey)
            .then((res) => {
                console.log(res.status);
                console.log('Body: ', res.data);
                let temp = res.data[0];
                let responseTask = {
                    id: temp.id,
                    name: temp.name,
                    loanId: loanId
                }
                response.json(responseTask);
            }).catch((err) => {
                console.error(err);
                response.json(err);
            });
    }


});

app.post('/Complete-Task', async (request, response) => {
    let taskId = request.body.id;
    let businessKey = request.body.loanId;
    let body = request.body;
    console.log(request.body);

    let data = {
        "variables": body.variables
    };

    await axios.post('http://localhost:8080/engine-rest/task/' + taskId + '/complete', data)
        .then((res) => {
            console.log(res.status);
            if(!res.data)
                console.log("---------Task Completed---------");
            else
                throw res.data;
        }).catch((err) => {
            console.error(err);
            response.json(err);
        });

    await axios.get('http://localhost:8080/engine-rest/task?processInstanceBusinessKey=' + businessKey)
        .then((res) => {
            console.log(res.status);
            console.log('Body: ', res.data);
            let temp = res.data[0];
            let responseTask;
            if(temp){
                responseTask = {
                    id: temp.id,
                    name: temp.name,
                    loanId: businessKey
                }
            }else{
                responseTask = "Process Completed";
            }
            
            response.json(responseTask);
        }).catch((err) => {
            console.error(err);
            response.json(err);
        });
});


app.listen(PORT, process.env.IP, () => {
    console.log("server is running on port", PORT);
});
