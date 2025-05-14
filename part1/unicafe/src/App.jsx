import {useState} from 'react';

const Button = props => {
    return <button onClick={() => props.onClick(props.feedback + 1)}>{props.text}</button>;
};

const Statistics = ({good, neutral, bad}) => {
    const all = good + neutral + bad;

    if (!all) return <p>No feedback given</p>;

    return (
        <>
            <h2>statistics</h2>
            <table>
                <tbody>
                    <StatisticLine
                        text="good"
                        value={good}
                    />
                    <StatisticLine
                        text="neutral"
                        value={neutral}
                    />
                    <StatisticLine
                        text="bad"
                        value={bad}
                    />
                    <StatisticLine
                        text="all"
                        value={all}
                    />
                    <StatisticLine
                        text="average"
                        value={(good * 1 - bad * 1) / all}
                    />
                    <StatisticLine
                        text="positive"
                        value={`${(good / all) * 100} %`}
                    />
                </tbody>
            </table>
        </>
    );
};

const StatisticLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    );
};

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    return (
        <>
            <h1>give feedback</h1>
            <Button
                text="good"
                feedback={good}
                onClick={setGood}
            />
            <Button
                text="neutral"
                feedback={neutral}
                onClick={setNeutral}
            />
            <Button
                text="bad"
                feedback={bad}
                onClick={setBad}
            />
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
            />
        </>
    );
};

export default App;
