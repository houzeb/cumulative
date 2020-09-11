<template>
  <div class="">
    <h3>具有数据校验功能的表单组件--Form</h3>
    <i-form ref="form" :model="formValidate" :rules="ruleValidate">
      <i-form-item label="用户名" prop="name">
        <i-input v-model="formValidate.name"></i-input>
      </i-form-item>
      <i-form-item label="邮箱" prop="mail">
        <i-input v-model="formValidate.mail"></i-input>
      </i-form-item>
      <i-form-item label="车辆类型" prop="mail">
        <i-checkbox-group v-model="checkboxValues">
          <i-checkbox
            v-for="(item, index) in checkboxList"
            :key="index"
            :label="item.id"
          >{{ item.name }}</i-checkbox>
        </i-checkbox-group>
      </i-form-item>
    </i-form>
    <button @click="handleSubmit">提交</button>
    <button @click="handleReset">重置</button>
  </div>
</template>

<script>
import iForm from '../components/form/form.vue';
import iFormItem from '../components/form/form-item.vue';
import iInput from '../components/input/input.vue';
import iCheckbox from '../components/checkbox/checkbox.vue';
import iCheckboxGroup from '../components/checkbox/checkbox-group.vue';

export default {
  components: { iForm, iFormItem, iInput, iCheckbox, iCheckboxGroup },
  data () {
    return {
      checkboxValues: [],
      checkboxList: [
        { id: 1, name: '私家车' },
        { id: 2, name: '企业小客车' },
        { id: 3, name: '网约车' }
      ],
      formValidate: {
        name: '',
        mail: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      console.log(this.checkboxValues, this.checkboxValues.join())
      this.$refs.form.validate((valid) => {
        if (valid) {
          window.alert('提交成功');
        } else {
          window.alert('表单校验失败');
        }
      });
    },
    handleReset () {
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style lang="css" scoped>
</style>
