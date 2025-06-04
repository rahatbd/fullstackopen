const Name = ({name}) => <h2>{name}</h2>;

const Content = ({parts}) => (
    <>
        {parts.map(part => (
            <Part
                key={part.id}
                name={part.name}
                exercises={part.exercises}
            />
        ))}
    </>
);

const Part = ({name, exercises}) => (
    <p>
        {name} {exercises}
    </p>
);

const Total = ({parts}) => {
    const total = parts.reduce((current, {exercises}) => (current += exercises), 0);

    return (
        <p>
            <strong>total of {total} exercises</strong>
        </p>
    );
};

const Course = ({courses}) => (
    <>
        {courses.map(course => (
            <div key={course.id}>
                <Name name={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        ))}
    </>
);

export default Course;
