/* 
 * This is a async function. It uses the keywords 'async' and 'await'.
 * When using this an asynchronous promise-based behavior can be used
 * instead of configure each promise specificly.
 * This allows less code to be used.
 * 
 */
(async () => {
  // Setting api url to the localhost
  const API_URL = `http://localhost:3000/courses`;

  // A function that uses fetch on the set url to get a
  // response and list the courses
  const getCourses = () => {
    return fetch(`${API_URL}`)
      .then(res => res.json())
      .then(res => {
        return res
      });
  }

  /* 
   * Function that will use fetch to get a specific course
   * decided by the id that was provided and then will use
   * the method DELETE to delte it
   * 
   */
  const deleteCourse = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.status === 204) {
          return true;
        } else {
          return false;
        }
      });
  }

  const addCourse = (course) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(course),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(`${API_URL}`, requestOptions)
      .then((response) => response.json())
      .then(() => {
        // Clears form when getting all the courses in the database
        document.querySelector("#add-course-wrapper form").reset();
        // now re-init
        init();
      })
      .catch((error) => console.error(`${error.message}`));
  };

  const renderEmpty = () => courseTableBody.innerHTML = `
    <tr>
    <td class="px-6 py-4 whitespace-nowrap" colspan="7">
      <div class="text-sm text-center text-gray-900">
        <em>No courses to show</em>
      </div>
    </td>
    </tr>
  `;

  const courseTableBody = document.querySelector('#course-table tbody');
  const addNewCourseButton = document.querySelector('#add-course');
  const addNewCourseFormWrapper = document.querySelector('#add-course-wrapper');
  const addNewCourseForm = document.querySelector('#add-course-wrapper form');

  addNewCourseButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.target.classList.toggle('open');
    addNewCourseFormWrapper.classList.toggle('sr-only');
  });

  addNewCourseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    new FormData(addNewCourseForm);
  });

  addNewCourseForm.addEventListener("formdata", (event) => {
    event.preventDefault();
    const data = event.formData;

    const course = {};

    for (let key of data.keys()) {
      course[key] = data.get(key);
    }

    addCourse(course);
  });

  const init = async () => {

    // Waiting for response from the getCourses function
    const courses = await getCourses();

    if (courses.length === 0) {
      renderEmpty();
    } else {
      courseTableBody.innerHTML = ''; // Hackety-hack to get rid of old stuff in the DOM
      // Foreach loop that will write the following code to index.html for each course
      courses.forEach(course => {
        courseTableBody.innerHTML += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              ${course._id}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              ${course.code}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              ${course.name}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span
              class="
                px-2
                inline-flex
                text-xs
                leading-5
                font-semibold
                rounded-full
                ${course.progression === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              "
            >
            ${!course.progression ? 'N/A' : course.progression}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${course.semester}</div>
          </td>
          <td
            class="
              px-6
              py-4
              whitespace-nowrap
              text-left text-sm
              font-medium
            "
          >
            <a href="${!course.syllabus ? '#' : course.syllabus}" class="text-indigo-600 hover:text-indigo-900"
              >${!course.syllabus ? 'N/A' : `View syllabus for ${course.code}`}</a>
          </td>
          <td
            class="
              px-6
              py-4
              whitespace-nowrap
              text-right text-sm
              font-medium
            "
          >
            <button
              data-id="${course._id}"
              type="submit"
              class="
                inline-flex
                justify-center
                py-2
                px-4
                border border-transparent
                shadow-sm
                text-sm
                font-medium
                rounded-md
                text-white
                bg-red-600
                hover:bg-red-700
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-red-500
              "
            >
              Delete
            </button>
          </td>
        </tr>
      `;
      });
    }
    bindEventListeners();
  };

  const bindEventListeners = () => {
    const deleteButtons = document.querySelectorAll('#course-table tbody button');

    deleteButtons.forEach(deleteButton => {
      deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (deleteCourse(event.target.dataset.id)) {
          courseTableBody.removeChild(event.target.parentElement.parentElement);
          if (courseTableBody.childElementCount === 0) {
            renderEmpty();
          }
        }
      });
    });
  }

  await init();
})();