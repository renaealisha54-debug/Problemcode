

Ŭ file
    filename = f"temp_{uuid.uuid4()}.{'py' if lang == 'python' else 'js'}"
    with open(filename, "w") as f:
        f.write(code)
    
    try:
        # Real Execution via Subprocess
        cmd = ["python3", filename] if lang == "python" else ["node", filename]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        return {"result": result.stdout if result.stdout else result.stderr}
    finally:
        if os.path.exists(filename): os.remove(filename)

@app.post("/api/generate-apk")
async def generate_apk(data: dict):
    project_id = str(uuid.uuid4())
    build_path = f"./builds/{project_id}"
    
    # 1. Scaffold from Template
    shutil.copytree("./templates/android-base", build_path)
    
    # 2. Inject Code into Assets
    with open(f"{build_path}/app/src/main/assets/index.js", "w") as f:
        f.write(data.get("code"))
    
    # 3. Trigger Real Gradle Build
    try:
        subprocess.run(["./gradlew", "assembleRelease"], cwd=build_path, check=True)
        apk_path = f"{build_path}/app/build/outputs/apk/release/app-release.apk"
        return FileResponse(apk_path, filename="ProblemCode_Export.apk")
    except Exception as e:
        return {"error": str(e)}
