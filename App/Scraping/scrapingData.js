

const pegarDados = (page) => {
    const promiseCallBack = async (resolve, reject) => {
        const dados = await page.evaluate(() => {
            const nodeList = document.querySelectorAll('section#job-listing > ul > li > a');
            const array = [];

            for (let i = 0; i < nodeList.length; i++){
                array.push(nodeList[i].getAttribute('aria-label'));
            }

            return array;
        });

        console.log(dados)

        resolve(page);
    };
    return new Promise(promiseCallBack);
}

const modifyEmpresa = (empresa) => {
    const website   = 'https://mudar.gupy.io/';

    const minusculaStr = empresa.toLowerCase();
    const replaceStr   =  minusculaStr.replace(/\s/g, '');
    return website.replace("mudar", replaceStr);

}

module.exports = {pegarDados, modifyEmpresa};