export function Home() {

  return (
    <>
      <h1 style={{textAlign: "center"}}>Welcome!</h1>
      <div className="welcome-message">
        <div className="home-div">
          Thanks for checking out my real-time messaging application. 
          This project is built with a modern full-stack Javascript architecture and 
          designed to provide an interactive chat experience.
         </div>
         <div className="home-div">
          Once users are registered they will be placed inside the "default"
          chat room. They can navigate to boards and join this chat room to test out functionality.
          To join more message boards, an admin must grant them access to the respective board.
          This ensures that users can only join boards they have access to.
         </div>
         <div className="home-div">
          Admins will have an extra navigation option to access the Admin Panel.
          Here they will be able to create new boards, delete existing boards, and manage users
          within boards. 
         </div>
         <div className="home-div">
          For a detailed overview of the project including technical highlights, development decisions, 
          scalability, future plans, and the full tech stack please visit the GitHub repository linked below.
         </div>
         <div className="home-div">
          <a className="home-link" href="https://github.com/WilliamTaul/taulkie" target="_blank" rel="noopener noreferrer">Taulkie's Repo</a>
         </div>
      </div>
    </>
    )
}