import subprocess
import time
import sys

def run_git_and_close():
    # યુઝર પાસેથી કમિટ મેસેજ મેળવો
    commit_message = input("તમારો કમિટ મેસેજ (Commit Message) ટાઇપ કરો: ")
    
    # જો મેસેજ ખાલી હોય તો ડિફોલ્ટ મેસેજ સેટ કરો
    if not commit_message.strip():
        commit_message = "UR CHANGE"
    
    # પાવરશેલ માટે કમાન્ડ
    command = f'powershell -Command "git add .; git commit -m \\"{commit_message}\\"; git push origin main"'
    
    try:
        print("\nGit કમાન્ડ્સ રન થઇ રહ્યા છે...")
        # કમાન્ડ રન કરો
        result = subprocess.run(command, check=True, shell=True, text=True, capture_output=True)
        
        print("\nસફળતાપૂર્વક અપલોડ (Push) થઇ ગયું!")
        print(result.stdout)
        
        # સફળતાપૂર્વક રન થયા પછી 5 સેકન્ડ રાહ જુઓ અને બંધ કરો
        print("\nઆ વિન્ડો 5 સેકન્ડમાં આપમેળે બંધ થઈ જશે...")
        time.sleep(5)
        sys.exit()  # પાયથન વિન્ડો બંધ કરવા માટે
        
    except subprocess.CalledProcessError as e:
        # જો ભૂલ આવે તો વિન્ડો બંધ નહીં થાય જેથી તમે એરર વાંચી શકો
        print("\nભૂલ (Error) આવી:")
        print(e.stderr)
        input("\nવિન્ડો બંધ કરવા માટે એન્ટર (Enter) દબાવો...")

if __name__ == "__main__":
    run_git_and_close()
