// Object Distructuring
let obj = {
    ananta: 5,
    ador: 'c'
}

let { ador } = obj;


// Array Distructuring
let arr = [4, 'a', 5.7, 'Hello']

let [a, b, c] = arr; // c = 5.7



// Power of async
const handleClick = async () => {
    for (let i = 0; i < 10; i++)
        await setCounter(counter + i);
};

useEffect(() => {
    console.log(counter);
}, [counter]);



// Fetching Data
const [todoData, setTodoData] = useState(null);

fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => {
        return response.json()
    })
    .then((data) => {
        setTodoData(data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })
    .finally(() => {

    });


fetch('/hiring/toggleApply', {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        hiringId: hiringId
    }),
})
    .then(response => {
        return response.json()
    })
    .then((data) => {
        setTodoData(data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })
    .finally(() => {

    });



// Text Field 
const [text, setText] = useState("");
(
    <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type here"
    />
)

// Dropdown
const [selectedValue, setSelectedValue] = useState("java");
(
    <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
    >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="javascript" />
        <Picker.Item label="Python" value="python" />
    </Picker>
)


// Switch
const [radioValue, setRadioValue] = useState("option1");
(
    <RadioButton.Group
        onValueChange={(value) => setRadioValue(value)}
        value={radioValue}
    >
        <RadioButton.Item label="Option 1" value="option1" />
        <RadioButton.Item label="Option 2" value="option2" />
    </RadioButton.Group>
)


// Radio Button
const [isChecked, setIsChecked] = useState(false);
(
    <Switch
        value={isChecked}
        onValueChange={(value) => setIsChecked(value)}
        style={{ marginBottom: 20 }}
    />
)




// Sort by value
updatedEmployees = [...employees].sort((a, b) => a.age - b.age);

// Remove basis on salay
updatedEmployees = employees.filter(emp => emp.salary >= 5000);

// Remove by given index 
function removeByIndex(givenIndex) {
    updatedEmployees = employees.filter((_, index) => index !== givenIndex);
}

// Add new entry in object Array
setEmployees([...employees, {
    name: "Ador",
    age: 414,
    salary: 5141
}]);



// Timeout
setTimeout(() => {
    console.log("Hello");
}, 3000);

// Timeout in useEffect
useEffect(() => {
    const timer = setTimeout(() => {
        console.log("Hello");
    }, 5000);

    return () => clearTimeout(timer); // cleanup
}, []);





//

// componentDidMount
useEffect(() => {
    console.log("Component mounted ✅");
}, []); // Empty dependency array = runs only once

// componentDidUpdate
useEffect(() => {
    if (count > 0) {
        console.log("Component updated 🔁");
    }
}, [count]); // Runs whenever `count` changes

// componentWillUnmount
useEffect(() => {
    return () => {
        console.log("Component will unmount ❌");
    };
}, []);