function runScript(){
    const code       = document.getElementById("code").value.replace(/\r?\n/g,'');
    const input      = document.getElementById("input").value.replace(/\r?\n/g,'');
    const output_box = document.getElementById("output");

    output_box.value = "";
    const words = Array(30000).fill(0);  // メモリ

    let array_count = 0;  // メモリ上の位置
    let code_count  = 0;  // 現在読んでいるコードの位置
    let input_count = 0;  // 入力の位置

    let loop_count = 0;  // ループ用スタック上の位置？
    let loop_stack = Array(30000).fill(0);  // ループの位置？

    while(code_count < code.length){
        //console.log("code_read:" + code_count);
        let token = code.slice(code_count, code_count+4);
        let p = -1;
        if((p = token.search("しゃけ")) != -1){
            array_count++;
            //console.log("array += 1 : " + array_count);
            if(words.length <= array_count) array_count = words.length - 1;
            code_count += p + 3;
        }else if((p = token.search("おかか")) != -1){
            array_count--;
            //console.log("array -= 1 : " + array_count);
            if(array_count < 0) array_count = 0;
            code_count += p + 3;
        }else if((p = token.search("ツナマヨ")) != -1){
            words[array_count]++;
            //console.log("array[" + array_count + "] += 1 : " + words[array_count]);
            code_count += p + 4;
        }else if((p = token.search("高菜")) != -1){
            words[array_count]--;
            if(words[array_count] < 0) words[array_count] = 0;
            //console.log("array[" + array_count + "] -= 1 : " + words[array_count]);
            code_count += p + 2;
        }else if((p = token.search("昆布")) != -1){
            output_box.value += String.fromCharCode(words[array_count]);
            //console.log(array_count + " " + words[array_count]);
            code_count += p + 2;
        }else if((p = token.search("明太子")) != -1){
            if(input.length < input_count){
                console.log("Input Length Over");
                break;
            }
            words[array_count] = input[input_count].charCodeAt(0);
            input_count++;
            code_count += p + 3;
        }else if((p = token.search("すじこ")) != -1){
            if(words[array_count] == 0){
                //jump
                // +1して次の字句の位置を指す
                let skip_count = 0;
                while(1){
                    let sliced_code = code.slice(code_count);
                    let loopbegin_idx = sliced_code.search("すじこ");
                    let loopend_idx   = sliced_code.search("いくら");
                    if(loopbegin_idx != -1 && loopbegin_idx < loopend_idx){
                        skip_count++;
                        code_count += loopbegin_idx + 1;
                    }else{
                        if(skip_count <= 0){
                            break;
                        }else{
                            skip_count--;
                            code_count += loopend_idx + 1;
                        }
                    }
                }
            }else{
                loop_stack[loop_count] = code_count;
                loop_count++;
                //console.log("loop(in):" + loop_count + " backpoint:" + code_count);
                code_count += p + 3;
            }
            // ツナマヨツナマヨすじこしゃけツナマヨおかか高菜高菜いくら昆布しゃけ昆布
        }else if((p = token.search("いくら")) != -1){
            if(words[array_count] != 0){
                //jump
                loop_count--;
                //console.log("loop(return):" + loop_count);
                code_count = loop_stack[loop_count];
            }else{
                code_count += p + 3;
                loop_count--;
                //console.log("loop(end):" + loop_count);
            }
        }else{
            //console.log("skipped");
            //console.log(code[code_count]);
            code_count++;
        }
    }

    //console.log("end")
}