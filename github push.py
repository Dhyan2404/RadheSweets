import subprocess

def run_git_automation():
    # યુઝર પાસેથી કમિટ મેસેજ મેળવો
    commit_message = input("તમારો કમિટ મેસેજ (Commit Message) ટાઇપ કરો: ")
    
    # જો મેસેજ ખાલી હોય તો ડિફોલ્ટ મેસેજ સેટ કરો
    if not commit_message.strip():
        commit_message = "UR CHANGE"
    
    # પાવરશેલ માટે કમાન્ડ તૈયાર કરો
    command = f'powershell -Command "git add .; git commit -m \\"{commit_message}\\"; git push origin main"'
    
    try:
        print("\nGit કમાન્ડ્સ રન થઇ રહ્યા છે...")
        # કમાન્ડ રન કરો
        result = subprocess.run(command, check=True, shell=True, text=True, capture_output=True)
        
        print("\nસફળતાપૂર્વક અપલોડ (Push) થઇ ગયું!")
        print(result.stdout)
        
    except subprocess.CalledProcessError as e:
        print("\nભૂલ (Error) આવી:")
        print(e.stderr)

if __name__ == "__main__":
    run_git_automation()
