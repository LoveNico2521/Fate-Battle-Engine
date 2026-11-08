import random

def roll_d10():
    """擲 1d10，若為 10 則自動追擲 1d2"""
    base_result = random.randint(1, 10)
    print(f"🎲 [1d10] 初始結果: {base_result}")
    
    if base_result == 10:
        extra_result = random.randint(1, 2)
        print(f"✨ 觸發大成功/大失敗(10)！自動追擲 1d2 -> 結果: {extra_result}")
        return {"type": "1d10", "base": base_result, "extra_d2": extra_result}
    
    return {"type": "1d10", "base": base_result, "extra_d2": None}

def roll_d100(critical_success_threshold=5, critical_failure_threshold=95):
    """
    擲 1d100，若 <= 5 或 >= 95 自動觸發追擲
    主人可以根據規則隨時調整觸發臨界值喵！
    """
    base_result = random.randint(1, 100)
    print(f"🎲 [1d100] 初始結果: {base_result}")
    
    # 判斷是否觸發極端值 (例如 <= 5 或 >= 95)
    if base_result <= critical_success_threshold or base_result >= critical_failure_threshold:
        print(f"⚡ 觸發極端值判定 ({base_result})！進行自動追擲...")
        # 這裡預設追擲 1d10 作為範例，主人也可以改為追擲 1d2 或其他骰子喵
        extra_result = random.randint(1, 10)
        print(f"✨ 自動追擲 1d10 -> 結果: {extra_result}")
        return {"type": "1d100", "base": base_result, "extra": extra_result}
    
    return {"type": "1d100", "base": base_result, "extra": None}

# ================= 測試執行區 =================
if __name__ == "__main__":
    print("--- 測試 1d10 擲骰 ---")
    for i in range(5):
        roll_d10()
        print("-" * 20)
        
    print("\n--- 測試 1d100 擲骰 ---")
    for i in range(5):
        roll_d100()
        print("-" * 20)