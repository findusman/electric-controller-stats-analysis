import { hours, timeIntervalIndex, colorMap } from "./data";
import axios from 'axios';


const categorizedData = {};
const seriesData = [{

    type: 'heatmap',
    data: []
}]

const getOption = async () => {


    let option = {}
    const apiURL = 'https://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed'

    try {

        const response = await axios.get(apiURL);

        const APIData = response.data


        const days = [...new Set(APIData.data.map(obj => obj.date))];
        const sourceTag = [...new Set(APIData.data.map(obj => obj.sourceTag))];

        APIData.data.forEach(obj => {
            if (categorizedData[obj.date]) {
                categorizedData[obj.date].push(obj);
            } else {
                categorizedData[obj.date] = [obj];
            }
        });

        days.forEach(async (day, index) => {
            await getGraphItemValues(day, index)
        });


        option = {
            tooltip: {
                position: 'top'
            },
            xAxis: {
                type: 'category',
                data: hours

            },
            yAxis: {
                type: 'category',
                data: days

            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                show: false
            },

            series: seriesData


        };


    } catch (err) { }
    return option;


}

async function getGraphItemValues(day, indexX) {

    categorizedData[day].forEach(async (dayItem, indexY) => {

        const date = dayItem.date;
        const minute_Window = dayItem.minute_window;
        const sourceTag = dayItem.sourceTag;
        const shortInterval = await getTimeIntervalInShortFormat(dayItem.minute_window)
        const finalIndexY = timeIntervalIndex[shortInterval]
        // console.log(shortInterval + ' ' + finalIndexY);

        let item = {
            value: [finalIndexY, indexX, 1],
            tooltip: { formatter: sourceTag + ' ' + minute_Window },
            itemStyle: { color: colorMap[sourceTag] }
        }
        seriesData[0].data.push(item)


    });




    // return item;
}

async function getTimeIntervalInShortFormat(date) {
    const datetimeString = date;
    const dateTime = new Date(datetimeString);
    const hours1 = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const extractedTime = hours1 + ':' + minutes;

    return extractedTime
}

export default getOption;


