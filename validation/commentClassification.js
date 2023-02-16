import fetch from "node-fetch";

async function clasify(data) {
    try{
        const response = await fetch(
            "https://api-inference.huggingface.co/models/unitary/toxic-bert",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    } catch(err){
        console.log(err)
    }
}

export default clasify;