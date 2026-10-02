import subprocess
import time
import sys

def run_git_and_close():
    # Prompt the user for a dynamic commit message
    commit_message = input("Enter your commit message: ")
    
    # If the message is empty, fall back to the default message
    if not commit_message.strip():
        commit_message = "UR CHANGE"
    
    # Construct the PowerShell command string chained with semicolons
    command = f'powershell -Command "git add .; git commit -m \\"{commit_message}\\"; git push origin main"'
    
    try:
        print("\nRunning Git commands...")
        # Execute the combined command string in the shell
        result = subprocess.run(command, check=True, shell=True, text=True, capture_output=True)
        
        print("\nSuccessfully pushed to origin main!")
        print(result.stdout)
        
        # Keep the window open for 5 seconds to let you read the success status
        print("\nThis window will automatically close in 5 seconds...")
        time.sleep(5)
        sys.exit()  # Closes the Python terminal window
        
    except subprocess.CalledProcessError as e:
        # If an error occurs, do not close immediately so you can read the error logs
        print("\nAn Error Occurred:")
        print(e.stderr)
        input("\nPress Enter to close this window...")

if __name__ == "__main__":
    run_git_and_close()
