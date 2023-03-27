class IDsManager {

    checkAvatar(isThin, userType, ids) {

        const JSON_DATA = {"data":{"accessory":{"line":"accesory","fill":"","numAssets":5,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"acc","colors":[{"hexa":"49fff9","name":"blue"},{"hexa":"fff651","name":"green"},{"hexa":"fcff00","name":"yellow"},{"hexa":"f395ff","name":"pink"}],"vipColors":[],"darkColor":[{"hexa":"0012f2"},{"hexa":"22ff00"},{"hexa":"d0da00"},{"hexa":"ff004c"}],"specificChanges":[],"basicThinAssets":[],"middleThinAssets":[],"vipThinAssets":[-1,0,1,2,3],"basicThickAssets":[],"middleThickAssets":[],"vipThickAssets":[-1,0,1,2,3]},"bangs":{"line":"bangs","fill":"bangs fill","numAssets":39,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"hair","colors":[{"hexa":"1d2c32","name":"black"},{"hexa":"543b2c","name":"darkbrown"},{"hexa":"935a32","name":"brown"},{"hexa":"e0de54","name":"blonde"},{"hexa":"f9f89e","name":"lightblonde"},{"hexa":"c8e8dd","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"27ffed","name":"cyan"},{"hexa":"ff24e9","name":"pink"},{"hexa":"aaff0b","name":"green"},{"hexa":"7045dc","name":"purple"},{"hexa":"e6175c","name":"red"}],"specificChanges":[{"type":"changeColor","slot":"eyebrows_fill","ref":"bangs fill","inv":false}],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"middleThinAssets":[29,30,31,32,33,34],"vipThinAssets":[35,36,37,38],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"middleThickAssets":[29,30,31,32,33,34],"vipThickAssets":[35,36,37,38]},"backhair":{"line":"backhair","fill":"backhair_fill","numAssets":17,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"hair","colors":[{"hexa":"1d2c32","name":"black"},{"hexa":"543b2c","name":"darkbrown"},{"hexa":"935a32","name":"brown"},{"hexa":"e0de54","name":"blonde"},{"hexa":"f9f89e","name":"lightblonde"},{"hexa":"c8e8dd","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"27ffed","name":"cyan"},{"hexa":"ff24e9","name":"pink"},{"hexa":"aaff0b","name":"green"},{"hexa":"7045dc","name":"purple"},{"hexa":"e6175c","name":"red"}],"specificChanges":[],"basicThinAssets":[-1,0,2,3,4,5,8,9,10,11,12,13,16],"middleThinAssets":[1,6,14],"vipThinAssets":[7,15],"basicThickAssets":[-1,0,2,3,4,5,8,9,10,11,12,13,16],"middleThickAssets":[1,6,14],"vipThickAssets":[7,15]},"accessory_ear":{"line":"accesory_ear","fill":"","numAssets":5,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"acc","colors":[],"vipColors":[],"specificChanges":[],"basicThinAssets":[],"middleThinAssets":[-1,0,1,2,3,4],"vipThinAssets":[],"basicThickAssets":[],"middleThickAssets":[-1,0,1,2,3,4],"vipThickAssets":[]},"eyebrows":{"line":"eyebrows","fill":"eyebrows_fill","numAssets":22,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"hair","colors":[{"hexa":"1d2c32","name":"black"},{"hexa":"543b2c","name":"darkbrown"},{"hexa":"935a32","name":"brown"},{"hexa":"e0de54","name":"blonde"},{"hexa":"f9f89e","name":"lightblonde"},{"hexa":"c8e8dd","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"27ffed","name":"cyan"},{"hexa":"ff24e9","name":"pink"},{"hexa":"aaff0b","name":"green"},{"hexa":"7045dc","name":"purple"},{"hexa":"e6175c","name":"red"}],"specificChanges":[],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"middleThickAssets":[],"vipThickAssets":[]},"eyes":{"line":"eyes","fill":"","numAssets":46,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"nan","colors":[],"vipColors":[],"specificChanges":[],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"middleThinAssets":[25,26,27,28,29,30,31,32,33],"vipThinAssets":[34,35,36,37,38,39,40,41,42,43,44,45],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"middleThickAssets":[25,26,27,28,29,30,31,32,33],"vipThickAssets":[34,35,36,37,38,39,40,41,42,43,44,45]},"nose":{"line":"nose","fill":"nose_skin_fill","numAssets":20,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],"middleThickAssets":[],"vipThickAssets":[]},"mouth":{"line":"mouth","fill":"mouth_fill","numAssets":34,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"mouth","colors":[{"hexa":"a1412e","name":"brick"},{"hexa":"ad6439","name":"tanlip"},{"hexa":"ec9162","name":"lightlip"},{"hexa":"353f47","name":"blacklip"}],"vipColors":[{"hexa":"005e9a","name":"bluelip"},{"hexa":"27ffec","name":"greenlip"},{"hexa":"9d65be","name":"purplelip"},{"hexa":"ff880e","name":"orangelip"},{"hexa":"c33246","name":"red"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[{"type":"changeColorCategory","ids":[30,31,32,33],"newLine":"moustache","newFill":"moustache_fill","colorType":"hair"}],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"middleThickAssets":[],"vipThickAssets":[]},"facialmark":{"line":"facialmark","fill":"facialmark_fill","numAssets":1,"probability":0.5,"vipAttachments":[],"assossiations":{},"colorType":"nan","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"14375b","name":"black"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"27ffec","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"},{"hexa":"ffdd00","name":"yellow"}],"specificChanges":[],"basicThinAssets":[],"middleThinAssets":[-1,0,1,2,3,4,5,6,7,8,9,10,11,12],"vipThinAssets":[],"basicThickAssets":[],"middleThickAssets":[-1,0,1,2,3,4,5,6,7,8,9,10,11,12],"vipThickAssets":[]},"head":{"line":"head","fill":"head_skin_fill","numAssets":10,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purple"}],"specificChanges":[{"type":"changeColor","slot":"torso_skin_fill","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"arm_skin_fill","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"pelvis_skin","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"nose_skin_fill","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"arm_skin_fill2","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"neck_skin_fill","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"leg_skin_fill","ref":"head_skin_fill","inv":false},{"type":"changeColor","slot":"leg_skin_fill2","ref":"head_skin_fill","inv":false}],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9],"middleThickAssets":[],"vipThickAssets":[]},"beard":{"line":"beard","fill":"beard_fill","numAssets":5,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"hair","colors":[{"hexa":"1d2c32","name":"black"},{"hexa":"543b2c","name":"darkbrown"},{"hexa":"935a32","name":"brown"},{"hexa":"e0de54","name":"blonde"},{"hexa":"f9f89e","name":"lightblonde"},{"hexa":"c8e8dd","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"27ffed","name":"cyan"},{"hexa":"ff24e9","name":"pink"},{"hexa":"aaff0b","name":"green"},{"hexa":"7045dc","name":"purple"},{"hexa":"e6175c","name":"red"}],"specificChanges":[],"basicThinAssets":[-1,0,1,2,3,4],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[-1,0,1,2,3,4],"middleThickAssets":[],"vipThickAssets":[]},"BODY TYPE":{"basicThinAssets":[0,1],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1],"middleThickAssets":[],"vipThickAssets":[]},"neck":{"line":"neck","fill":"neck_accesory_fill","numAssets":6,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[0,1],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[2,3,4,5],"middleThickAssets":[],"vipThickAssets":[]},"arm_skin":{"line":"arm_skin","fill":"arm_skin_fill","numAssets":3,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{"name":"arm_skin2","fill":"arm_skin_fill2"},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[],"basicThinAssets":[2],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1],"middleThickAssets":[],"vipThickAssets":[]},"jackets":{"line":"jackets","fill":"jackets_fill","numAssets":6,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[-1,0,1,2,3,4,5],"middleThickAssets":[],"vipThickAssets":[]},"torso":{"line":"torso","fill":"torso_skin_fill","numAssets":4,"probability":1,"vipAttachments":[],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[{"type":"forceTogether","parnerSlot":"neck_skin_fill","parnerSlotFill":"","inv":false,"att":["q_torso/torso_01","q_torso/torso_01","q_torso/torso_03","q_torso/torso_04"],"parner":["m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thick_fill"],"attFill":[],"parnerFill":[]}],"basicThinAssets":[0,1,2],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[3],"middleThickAssets":[],"vipThickAssets":[]},"tops":{"line":"tops","fill":"tops_fill","numAssets":41,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[{"type":"changeColor","slot":"flaps_fill","ref":"tops_fill","inv":true},{"type":"forceTogether","parnerSlot":"flaps","parnerSlotFill":"flaps_fill","inv":true,"att":["p_tops/tops_01","p_tops/tops_03","p_tops/tops_07"],"parner":["k_flaps/flaps_01","k_flaps/flaps_02","k_flaps/flaps_03"],"attFill":["p_tops/tops_01_fill","p_tops/tops_03_fill","p_tops/tops_07_fill"],"parnerFill":["k_flaps/flaps_01_fill","k_flaps/flaps_02_fill","k_flaps/flaps_03_fill"]}],"basicThinAssets":[0,1,2,3,4,5,6,8,9,11,12,14,16,19,20,21,22,23,24],"middleThinAssets":[10,15,17],"vipThinAssets":[7,13,18],"basicThickAssets":[25,27,30,31,32,33,34,35,36,37,39],"middleThickAssets":[28,29,38],"vipThickAssets":[26,40]},"arm":{"line":"arm_front_accesory","fill":"arm_front_accesory_fill","numAssets":31,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{"name":"arm_front_accesory2","fill":"arm_front_accesory_fill2"},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[{"type":"forceTogether","parnerSlot":"arm_skin_fill","parnerSlotFill":"arm_skin_fill2","inv":false,"att":["l_arm/arm_30","l_arm/arm_31","l_arm/arm_29","l_arm/arm_17"],"parner":["l_arm_skin/arm_thick_skin_2_fill","l_arm_skin/arm_thick_skin_2_fill","l_arm_skin/arm_thick_skin_1_fill","l_arm_skin/arm_thick_skin_1_fill"],"attFill":["l_arm/arm_30","l_arm/arm_31","l_arm/arm_29","l_arm/arm_17"],"parnerFill":["l_arm_skin/arm_thick_skin_2_fill","l_arm_skin/arm_thick_skin_2_fill","l_arm_skin/arm_thick_skin_1_fill","l_arm_skin/arm_thick_skin_1_fill"]}],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],"middleThickAssets":[],"vipThickAssets":[]},"cape":{"line":"cape","fill":"cape_fill","numAssets":9,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[-1,0,1,2,3,4,5,6,7,8],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[-1,0,1,2,3,4,5,6,7,8],"middleThickAssets":[],"vipThickAssets":[]},"belts":{"line":"belts","fill":"belts_fill","numAssets":7,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[-1,0,1,2,3,4,5,6],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[-1,0,1,2,3,4,5,6],"middleThickAssets":[],"vipThickAssets":[]},"bottom":{"line":"bottom","fill":"bottom_fill","numAssets":31,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[{"type":"changeColor","slot":"bottom_back_fill","ref":"bottom_fill","inv":false},{"type":"forceTogether","parnerSlot":"bottom_back","parnerSlotFill":"bottom_back_fill","inv":true,"att":["s_bottom/bottom_11","s_bottom/bottom_12","s_bottom/bottom_13","s_bottom/bottom_14","s_bottom/bottom_15","s_bottom/bottom_16","s_bottom/bottom_17","s_bottom/bottom_18","s_bottom/bottom_19","s_bottom/bottom_20","s_bottom/bottom_21","s_bottom/bottom_22","s_bottom/bottom_23","s_bottom/bottom_24","s_bottom/bottom_25","s_bottom/bottom_26","s_bottom/bottom_27","s_bottom/bottom_28","s_bottom/bottom_29","s_bottom/bottom_30","s_bottom/bottom_31","s_bottom/bottom_32"],"parner":["bottom_back/bottom_back_11","bottom_back/bottom_back_12","bottom_back/bottom_back_13","bottom_back/bottom_back_14","bottom_back/bottom_back_15","bottom_back/bottom_back_16","bottom_back/bottom_back_17","bottom_back/bottom_back_18","bottom_back/bottom_back_19","bottom_back/bottom_back_20","bottom_back/bottom_back_21","bottom_back/bottom_back_22","bottom_back/bottom_back_23","bottom_back/bottom_back_24","bottom_back/bottom_back_25","bottom_back/bottom_back_26","bottom_back/bottom_back_27","bottom_back/bottom_back_28","bottom_back/bottom_back_29","bottom_back/bottom_back_30","bottom_back/bottom_back_31","bottom_back/bottom_back_31"],"attFill":["s_bottom/bottom_11_fill","s_bottom/bottom_12_fill","s_bottom/bottom_13_fill","s_bottom/bottom_14_fill","s_bottom/bottom_15_fill","s_bottom/bottom_16_fill","s_bottom/bottom_17_fill","s_bottom/bottom_18_fill","s_bottom/bottom_19_fill","s_bottom/bottom_20_fill","s_bottom/bottom_21_fill","s_bottom/bottom_22_fill","s_bottom/bottom_23_fill","s_bottom/bottom_24_fill","s_bottom/bottom_25_fill","s_bottom/bottom_26_fill","s_bottom/bottom_27_fill","s_bottom/bottom_28_fill","s_bottom/bottom_29_fill","s_bottom/bottom_30_fill","s_bottom/bottom_31_fill"],"parnerFill":["bottom_back/bottom_back_11_fill","bottom_back/bottom_back_12_fill","bottom_back/bottom_back_13_fill","bottom_back/bottom_back_14_fill","bottom_back/bottom_back_15_fill","bottom_back/bottom_back_16_fill","bottom_back/bottom_back_17_fill","bottom_back/bottom_back_18_fill","bottom_back/bottom_back_19_fill","bottom_back/bottom_back_20_fill","bottom_back/bottom_back_21_fill","bottom_back/bottom_back_22_fill","bottom_back/bottom_back_23_fill","bottom_back/bottom_back_24_fill","bottom_back/bottom_back_25_fill","bottom_back/bottom_back_26_fill","bottom_back/bottom_back_27_fill","bottom_back/bottom_back_28_fill","bottom_back/bottom_back_29_fill","bottom_back/bottom_back_30_fill","bottom_back/bottom_back_31_fill"]}],"basicThinAssets":[0,1,2,3,4,5,6,7,8,9,10,13,15,16,17,18,20,22,23,24,25,27,28,29],"middleThinAssets":[11,14,19,26],"vipThinAssets":[12,21,30],"basicThickAssets":[0,1,2,3,4,5,6,7,8,9,10,13,15,16,17,18,20,22,23,24,25,27,28,29],"middleThickAssets":[11,14,19,26],"vipThickAssets":[12,21,30]},"bottom_back":{"line":"bottom","fill":"bottom_fill","numAssets":21,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[10,13,15,16,17,18,20,22,23,24,25,27,28,29],"middleThinAssets":[11,14,19,26],"vipThinAssets":[12,21,30],"basicThickAssets":[10,13,15,16,17,18,20,22,23,24,25,27,28,29],"middleThickAssets":[11,14,19,26],"vipThickAssets":[12,21,30]},"leg":{"line":"leg_sock","fill":"leg_sock_fill","numAssets":7,"probability":0.5,"vipAttachments":[{"name":" "}],"assossiations":{"name":"leg_sock2","fill":"leg_sock_fill2"},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[-1,0,1,2,3,4,5,6],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[-1,0,1,2,3,4,5,6],"middleThickAssets":[],"vipThickAssets":[]},"shoes":{"line":"shoes","fill":"shoes_fill","numAssets":13,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{"name":"shoes2","fill":"shoes_fill2"},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"purple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[0,1,2,3,5,9,10,11],"middleThinAssets":[4,6,7],"vipThinAssets":[8,12],"basicThickAssets":[0,1,2,3,5,9,10,11],"middleThickAssets":[4,6,7],"vipThickAssets":[8,12]},"leg_skin":{"line":"leg_skin","fill":"leg_skin_fill","numAssets":4,"probability":1,"vipAttachments":[],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[{"type":"forceTogether","parnerSlot":"neck_skin_fill","parnerSlotFill":"","inv":false,"att":["q_torso/torso_01","q_torso/torso_01","q_torso/torso_03","q_torso/torso_04"],"parner":["m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thin_fill","m_neck_skin/neck_skin_thick_fill"],"attFill":[],"parnerFill":[]}],"basicThinAssets":[0],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0],"middleThickAssets":[],"vipThickAssets":[]},"neck_skin":{"line":"neck","fill":"neck_skin_fill","numAssets":4,"probability":1,"vipAttachments":[],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[],"basicThinAssets":[0],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[1],"middleThickAssets":[],"vipThickAssets":[]},"pelvis":{"line":"pelvis_skin","fill":"","numAssets":1,"probability":1,"vipAttachments":[],"assossiations":{},"colorType":"skin","colors":[{"hexa":"6b4033","name":"dark"},{"hexa":"be764b","name":"tan"},{"hexa":"dca473","name":"mediumtan"},{"hexa":"f7cd96","name":"light"},{"hexa":"efdebc","name":"superlight"}],"vipColors":[{"hexa":"69afd8","name":"blueskin"},{"hexa":"9bd05d","name":"greenskin"},{"hexa":"ffd100","name":"yellowskin"},{"hexa":"9274f9","name":"purpleskin"}],"specificChanges":[],"basicThinAssets":[0],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0],"middleThickAssets":[],"vipThickAssets":[]},"flaps":{"line":"flaps","fill":"flaps_fill","numAssets":3,"probability":1,"vipAttachments":[{"name":" "}],"assossiations":{},"colorType":"cloth","colors":[{"hexa":"e6175c","name":"red"},{"hexa":"aaff0b","name":"green"},{"hexa":"04a1fc","name":"blue"},{"hexa":"14375b","name":"darkblue"},{"hexa":"5c6e7c","name":"gray"},{"hexa":"ffffff","name":"white"}],"vipColors":[{"hexa":"ff870e","name":"orange"},{"hexa":"ffdd00","name":"yellow"},{"hexa":"00a19c","name":"darkgreen"},{"hexa":"27ffed","name":"cyan"},{"hexa":"521ff9","name":"bluepurple"},{"hexa":"ff24e9","name":"pink"}],"specificChanges":[],"basicThinAssets":[0,1,2],"middleThinAssets":[],"vipThinAssets":[],"basicThickAssets":[0,1,2],"middleThickAssets":[],"vipThickAssets":[]}}};

        let ret = true;
        let error = null;
        let array = [];

        for (let aux in ids) {
            if (aux) {
                array.push(aux);
            }
        }

        if (array.length !== 27) {
            ret = false;
            error = "wrong number of fields: " + array.length.toString() + "/27";
            return {ret: ret, error: error }; 
        }
        for(let iterator = 0; iterator < array.length; ++iterator) {

            const currentSlot = JSON_DATA["data"][array[iterator]];
            const currentData = ids[array[iterator]];

            if (!currentData) {
                ret = false;
                error = array[iterator] + " don't have value";
                break;
            }

            // thin body can't have jacket
            if (isThin && array[iterator] === "JACKET" && currentData.color !== null) {
                ret = false;
                error = array[iterator] + " in Thin Avatar";
                break;
            }

            if (userType !== "HI-CLONE" && array[iterator] === "accessory") {
                if(currentData.id !== null || currentData.color !== null) {
                    ret = false;
                    error = array[iterator] + " in " + userType;
                    break;
                }
            }

            if (userType === "PLEB" && (array[iterator] === "accessory_ear" || array[iterator] === "facialmark")) {
                if(currentData.id !== null || currentData.color !== null) {
                    ret = false;
                    error = array[iterator] + " in " + userType;

                    break;
                }
            }

            // check body size asset
            let assets = [];
            if (isThin) {
                
                assets = assets.concat(currentSlot.basicThinAssets);
                if (userType === "UBERNORM" || userType === "HI-CLONE") {
                    assets = assets.concat(currentSlot.middleThinAssets);
                    if(userType === "HI-CLONE") {
                        assets = assets.concat(currentSlot.vipThinAssets);
                    }
                }
            } else {
                assets = assets.concat(currentSlot.basicThickAssets);
                if (userType === "UBERNORM" || userType === "HI-CLONE") {
                    assets = assets.concat(currentSlot.middleThickAssets);
                    if(userType === "HI-CLONE") {
                        assets = assets.concat(currentSlot.vipThickAssets);
                    }
                }
            }

            let isValidID = false;
            let j = 0;
            for (j; j < assets.length; ++j) {
                let id;

                if (assets[j] + 1  < 10) {
                    id = "0" + (assets[j] + 1).toString();
                } else {
                    id = (assets[j] + 1).toString();
                }

                if (array[iterator] === "arm_skin") {
                    if (assets[j] === 0) {
                        id = "thick_1";
                    } else if (assets[j] === 1) {
                        id = "thick_2";
                    } else if (assets[j] === 2) {
                        id = "thin";
                    }
                } else if (array[iterator] === "neck_skin") {
                    if (assets[j] === 0) {
                        id = "thin";
                    } else if (assets[j] === 1) {
                        id = "thick";
                    }
                } else if (array[iterator] === "pelvis" || array[iterator] === "leg_skin") {
                    id = "";
                }

                if (currentData.id === id) {
                    isValidID = true;
                    break;
                }
            }
            if (currentData.id === null) {
                isValidID = true;
            }

            if (!isValidID) {
                ret = false;
                error = array[iterator] + " Invalid ID: " + currentData.id;
                break; 
            }
            
            // checkColor
            let colors = [];
            if (array[iterator] === "mouth" && (assets[j] === 30 || assets[j] === 31 || assets[j] === 32 || assets[j] === 33)) {
               
                colors = colors.concat(JSON_DATA["data"]["beard"].colors);
            
                if (userType === "HI-CLONE") {
                    colors = colors.concat(JSON_DATA["data"]["beard"].vipColors);
                }
            
            } else {

                colors = colors.concat(currentSlot.colors);
                
                if (userType === "HI-CLONE") {
                    colors = colors.concat(currentSlot.vipColors);
                }
                
            }

           
            let isValidColor = false;
            if(currentData.color === null || !colors) {
                isValidColor = true;
            } else {

                for (let j = 0; j < colors.length; ++j) {
                    if (currentData.color === colors[j].name) {
                        isValidColor = true;
                        break;
                    }
                }
            }
            

            if (!isValidColor) {
                ret = false;
                error = array[iterator] + " Invalid Color: " + currentData.color;
                break; 
            }

            if (currentData.id === null && currentSlot.probability === 1 && array[iterator] !== "bottom_back" && array[iterator] !== "flaps") {
                ret = false;
                error = array[iterator] + " Invalid id: null";
                break; 
            }
        }

        return {ret: ret, error: error };  

    }

}

module.exports.IDsManager = IDsManager;
