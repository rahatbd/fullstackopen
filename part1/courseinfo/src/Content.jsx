import Part from './Part';

const Content = props => (
    <>
        <Part part={props.course.parts[0]} />
        <Part part={props.course.parts[1]} />
        <Part part={props.course.parts[2]} />
    </>
);

export default Content;
